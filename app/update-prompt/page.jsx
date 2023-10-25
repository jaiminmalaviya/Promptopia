'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

import Form from '@components/Form'

const EditPrompt = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const searchParams = useSearchParams()
    const promptId = searchParams.get('id')

    const [submitting, setIsSubmitting] = useState(false)
    const [post, setPost] = useState({ prompt: '', tag: '' })

    useEffect(() => {
        const getPromptDetails = async () => {
            const response = await fetch(`/api/prompt/${promptId}`)
            const data = await response.json()

            setPost({
                prompt: data.prompt,
                tag: data.tag,
            })
        }

        if (promptId) getPromptDetails()
    }, [promptId])

    const updatePrompt = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        if (!promptId) return alert('Prompt ID not found')

        const newTag = post.tag
            .split(/[,\s]+/)
            .map((value) => value.replace(/#/g, ''))
            .join(' ')

        try {
            if (session?.user.id) {
                const response = await fetch(`/api/prompt/${promptId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        prompt: post.prompt,
                        tag: newTag,
                    }),
                })
                if (response.ok) {
                    router.push('/')
                    toast.success('Prompt edited successfully!', {
                        id: 'success',
                    })
                }
            } else {
                throw new Error('You must be logged in to edit prompt.')
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
                type="Edit"
                post={post}
                setPost={setPost}
                submitting={submitting}
                handleSubmit={updatePrompt}
            />
        </>
    )
}

export default EditPrompt
