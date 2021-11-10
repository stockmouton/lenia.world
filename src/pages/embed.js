import React from "react"
import styled from "styled-components"
import { useQueryParam, NumberParam } from "use-query-params";

const Video = styled.video`
    width: 100%    !important;
    height: auto   !important;
`
const EmbedPage = () => {
    let [id] = useQueryParam("id", NumberParam);
    if (typeof id === 'undefined') {
        id = 0;
    }

    return (
        <Video key={id} preload='auto' loop autoPlay muted playsInline>
            <source src={`/metadata/${id}.mp4`} type="video/mp4" />
            <p>Couldn&lsquo;t load this Lenia, please use a better browser ;)</p>
        </Video>
    )
}

export default EmbedPage