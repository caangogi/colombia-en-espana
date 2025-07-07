import { NextRequest, NextResponse } from 'next/server'
import { fetchBlogPosts } from '@/lib/api'

export async function GET(request: NextRequest) {
  const baseUrl = 'https://colombiaenespana.com'
  
  try {
    const posts = await fetchBlogPosts()
    const publishedPosts = posts.filter((post: any) => post.status === 'publicado').slice(0, 20)
    
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Colombia en España - Blog</title>
    <description>Guías, consejos y recursos para colombianos que migran a España. Información actualizada sobre trámites, vida práctica y cultura.</description>
    <link>${baseUrl}</link>
    <language>es-ES</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>Next.js</generator>
    <copyright>Copyright © ${new Date().getFullYear()} Colombia en España</copyright>
    <category>Migration</category>
    <category>Colombia</category>
    <category>España</category>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Colombia en España</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${publishedPosts.map((post: any) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
      <dc:creator><![CDATA[Jennifer Mendoza]]></dc:creator>
      <category><![CDATA[${post.category}]]></category>
      ${post.imageUrl ? `<enclosure url="${post.imageUrl}" type="image/jpeg"/>` : ''}
      <content:encoded><![CDATA[
        <div>
          ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" style="max-width: 100%; height: auto; margin-bottom: 20px;">` : ''}
          <p>${post.excerpt}</p>
          <p><a href="${baseUrl}/blog/${post.slug}">Leer artículo completo →</a></p>
        </div>
      ]]></content:encoded>
    </item>`).join('')}
  </channel>
</rss>`

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}