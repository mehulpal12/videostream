import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SIGNING_SECRET from Clerk Dashboard to .env')
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: No svix headers found', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

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

  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { 
      id: clerkId, 
      email_addresses, 
      image_url, 
      first_name, 
      last_name, 
      username,
      public_metadata
    } = evt.data

    const email = email_addresses?.[0]?.email_address;
    
    if (!email) {
      return new Response('Error: No email address found', { status: 400 })
    }

    // Role mapping from Clerk Public Metadata
    const role = (public_metadata?.role as string) || "STUDENT";

    

    try {
      // SYSTEMATIC SYNC: Follows your specific User Schema
      await prisma.user.upsert({
        where: { clerkId: clerkId as string },
        update: {
          email,
          username: username as string | null,
          firstName: first_name as string | null,
          lastName: last_name as string | null,
          imageUrl: image_url as string,
          role: role,
        },
        create: {
          clerkId: clerkId as string,
          email,
          username: username as string | null,
          firstName: first_name as string | null,
          lastName: last_name as string | null,
          imageUrl: image_url as string,
          role: role,
        },
      })
      console.log(`✅ DB Sync Success: ${clerkId} (${email})`)
    } catch (dbError: any) {
      // 1. Handle Unique Email Collision (P2002)
      if (dbError.code === 'P2002') {
        console.error(`❌ Email Collision: ${email} already exists in DB.`);
        return new Response('Error: Email already exists', { status: 409 })
      }
      
      console.error("❌ Database sync error:", dbError)
      return new Response('Database Error', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data
    try {
      // Systematic removal to prevent orphaned progress data
      await prisma.user.delete({ 
        where: { clerkId: id } 
      })
      console.log(`❌ User ${id} deleted from DB`)
    } catch (err) {
      console.log(`User ${id} already deleted or not found.`)
    }
  }

  return new Response('Webhook processed successfully', { status: 200 })
}