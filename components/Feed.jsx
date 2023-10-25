'use client'

import { useState, useEffect } from 'react'
import PromptCard from './PromptCard'

const PromptCardList = ({ data, handleTagClick }) => {
    return (
        <div className="mt-16 prompt_layout">
            {data.map((post) => (
                <PromptCard key={post._id} post={post} handleTagClick={handleTagClick} />
            ))}
        </div>
    )
}

const Feed = () => {
    const [searchText, setSearchText] = useState('')
    const [posts, setPosts] = useState([])
    const [originalPosts, setOriginalPosts] = useState([])
    const [searchTimer, setSearchTimer] = useState(null)

    useEffect(() => {
        // Fetch and store the original posts from your API
        const fetchPosts = async () => {
            const response = await fetch('/api/prompt')
            const data = await response.json()
            setPosts(data)
            setOriginalPosts(data)
        }
        fetchPosts()
    }, [])

    const searchPrompt = (searchText) => {
        if (!searchText) {
            setPosts(originalPosts)
        } else {
            const regex = new RegExp(searchText, 'i')

            const searchPost = originalPosts.filter((post) => {
                return (
                    regex.test(post.prompt) ||
                    searchText
                        .split(/\s+/)
                        .every((value) => new RegExp(value, 'i').test(post.tag)) ||
                    regex.test(post.creator.username)
                )
            })
            setPosts(searchPost)
        }
    }

    const handleSearchChange = (e) => {
        const newSearchText = e.target.value
        setSearchText(newSearchText)

        clearTimeout(searchTimer)

        const timer = setTimeout(() => {
            searchPrompt(newSearchText)
        }, 500)

        setSearchTimer(timer)
    }

    const handleTagClick = (tag) => {
        setSearchText(tag)
        searchPrompt(tag)
    }

    return (
        <section className="feed">
            <form onSubmit={(e) => e.preventDefault()} className="relative w-full flex-center ">
                <input
                    type="text"
                    placeholder="Search for a tag or a username"
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                    className="search_input peer"
                />
            </form>

            <PromptCardList data={posts} handleTagClick={handleTagClick} />
        </section>
    )
}

export default Feed
