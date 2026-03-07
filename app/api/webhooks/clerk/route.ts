import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  // 1. Get the Secret
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SIGNING_SECRET from Clerk Dashboard to .env')
  }

  // 2. Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: No svix headers found', { status: 400 })
  }

  // 3. Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // 4. Verify the webhook
  const wh = new Webhook(SIGNING_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error: Verification failed', { status: 400 })
  }

  // 5. Handle the Payload
  const { id } = evt.data
  const eventType = evt.type

  console.log(`Webhook received | ID: ${id} | Type: ${eventType}`)

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { 
      id: clerkId, 
      email_addresses, 
      image_url, 
      first_name, 
      last_name, 
      username,
      last_active_at,
      last_sign_in_at,
      public_metadata,
      unsafe_metadata,
      banned
    } = evt.data

    const email = email_addresses?.[0]?.email_address || `dumwerrewrsemy-${clerkId}@clerk.test`;

    try {
      await prisma.user.upsert({
        where: { clerkId: clerkId as string },
        update: {
          email,
          username: username as string | null,
          firstName: first_name as string | null,
          lastName: last_name as string | null,
          imageUrl: image_url as string,
          banned: banned as boolean ?? false,
          publicMetadata: (public_metadata as any) || {},
          unsafeMetadata: (unsafe_metadata as any) || {},
          // Convert timestamps to Date objects
          lastActiveAt: last_active_at ? new Date(last_active_at) : null,
          lastSignInAt: last_sign_in_at ? new Date(last_sign_in_at) : null,
        },
        create: {
          clerkId: clerkId as string,
          email,
          username: username as string | null,
          firstName: first_name as string | null,
          lastName: last_name as string | null,
          imageUrl: image_url as string,
          publicMetadata: (public_metadata as any) || {},
          unsafeMetadata: (unsafe_metadata as any) || {},
        },
      })
      console.log(`✅ DB Sync Success: ${clerkId}`)
    } catch (dbError) {
      console.error("❌ Database sync error:", dbError)
      return new Response('Database Error', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    try {
      await prisma.user.delete({ where: { clerkId: id } })
      console.log(`❌ User ${id} deleted from DB`)
    } catch (err) {
      console.log(`User ${id} already deleted or not found.`)
    }
  }

  return new Response('Webhook processed successfully', { status: 200 })
}