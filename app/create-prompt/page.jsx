'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import Form from '@components/Form'

const CreatePrompt = () => {
    const router = useRouter()
    const { data: session } = useSession()

    const [submitting, setIsSubmitting] = useState(false)
    const [post, setPost] = useState({ prompt: '', tag: '' })

    const createPrompt = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        const newTag = post.tag
            .split(/[,\s]+/)
            .map((value) => value.replace(/#/g, ''))
            .join(' ')

        try {
            if (session?.user.id) {
                const response = await fetch('/api/prompt/new', {
                    method: 'POST',
                    body: JSON.stringify({
                        prompt: post.prompt,
                        userId: session?.user.id,
                        tag: newTag,
                    }),
                })

                if (response.ok) {
                    router.push('/')
                    toast.success('Prompt created successfully!', {
                        id: 'success',
                    })
                }
            } else {
                throw new Error('You must be logged in to create prompt.')
            }
        } catch (error) {
            toast.error(error.message, {
                id: 'error',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Form
                type="Create"
                post={post}
                setPost={setPost}
                submitting={submitting}
                handleSubmit={createPrompt}
            />
        </>
    )
}

export default CreatePrompt
