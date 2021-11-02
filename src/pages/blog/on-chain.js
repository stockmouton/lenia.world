import React from 'react'
import ReactDom from 'react-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const markdown = require('!!raw-loader!./on-chain.md')

const OnChainPage = () => {
    return (
        <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
    )
}

export default OnChainPage