import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

require("./template.css")
const markdown = require('!!raw-loader!./on-chain.md').default

const OnChainPage = () => {
    return (
        <ReactMarkdown className="markdown" children={markdown} remarkPlugins={[remarkGfm]} />
    )
}

export default OnChainPage