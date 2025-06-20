const components = [
    // HTML Tags: Document Metadata
    {
        c: "HTML DOCTYPE Declaration",
        d: "The &lt;!DOCTYPE&gt; declaration is placed at the start of an HTML document to specify the document type and version (e.g., HTML5). It ensures browsers render the page in standards mode, preventing quirks mode. It’s not a tag but a required instruction for valid HTML.",
        e: "&lt;!DOCTYPE html&gt;"
    },
    {
        c: "HTML Tag",
        d: "The &lt;html&gt; tag is the root element of an HTML document, encapsulating all content. It typically includes the 'lang' attribute (e.g., 'en') to define the document’s language for accessibility and SEO. All other tags (except &lt;!DOCTYPE&gt;) are nested within it.",
        e: "&lt;html lang=&quot;en&quot;&gt;&lt;/html&gt;"
    },
    {
        c: "HTML Head Tag",
        d: "The &lt;head&gt; tag contains metadata, links to external resources (e.g., CSS, JavaScript), and other non-visible elements like &lt;title&gt; and &lt;meta&gt;. It defines document properties such as character encoding, viewport settings, and SEO data.",
        e: "&lt;head&gt;&lt;title&gt;My Page&lt;/title&gt;&lt;/head&gt;"
    },
    {
        c: "HTML Title Tag",
        d: "The &lt;title&gt; tag sets the title of the webpage, displayed in the browser’s title bar or tab. It’s critical for SEO, accessibility, and user orientation. It must be unique and descriptive for each page.",
        e: "&lt;title&gt;Welcome to My Website&lt;/title&gt;"
    },
    {
        c: "HTML Base Tag",
        d: "The &lt;base&gt; tag specifies a default URL or target for all relative URLs in a document. It’s typically used in the &lt;head&gt; and can include 'href' for base URLs or 'target' (e.g., '_blank') for link behavior. Only one &lt;base&gt; tag is allowed per document.",
        e: "&lt;base href=&quot;https://example.com/&quot; target=&quot;_blank&quot;&gt;"
    },
    {
        c: "HTML Link Tag",
        d: "The &lt;link&gt; tag defines relationships between the current document and external resources, most commonly used to link CSS files via the 'href' and 'rel' attributes (e.g., 'stylesheet'). It’s a self-closing tag placed in the &lt;head&gt;.",
        e: "&lt;link rel=&quot;stylesheet&quot; href=&quot;styles.css&quot;&gt;"
    },
    {
        c: "HTML Meta Tag",
        d: "The &lt;meta&gt; tag provides metadata about the HTML document, such as character encoding ('charset'), viewport settings for responsive design, or SEO descriptions. It’s self-closing and uses attributes like 'name' and 'content'.",
        e: "&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;"
    },
    {
        c: "HTML Style Tag",
        d: "The &lt;style&gt; tag embeds CSS directly within an HTML document, typically in the &lt;head&gt;. It defines styling rules for elements, allowing inline CSS without external files. The 'media' attribute can apply styles conditionally.",
        e: "&lt;style&gt; body { background-color: #f0f0f0; } &lt;/style&gt;"
    },
    {
        c: "HTML Script Tag",
        d: "The &lt;script&gt; tag embeds or links to JavaScript code. It can include inline scripts or external files via the 'src' attribute. Attributes like 'async' or 'defer' control script loading behavior for performance optimization.",
        e: "&lt;script src=&quot;app.js&quot; defer&gt;&lt;/script&gt;"
    },
    {
        c: "HTML Noscript Tag",
        d: "The &lt;noscript&gt; tag provides fallback content for browsers with disabled or unsupported JavaScript. It’s typically used to display messages or alternative content to ensure accessibility.",
        e: "&lt;noscript&gt;Please enable JavaScript to view this site.&lt;/noscript&gt;"
    },

    // HTML Tags: Sectioning & Structure
    {
        c: "HTML Body Tag",
        d: "The &lt;body&gt; tag contains all visible content of a webpage, such as text, images, and interactive elements. It’s the primary container for the document’s structure and supports global attributes like 'class' or 'id'.",
        e: "&lt;body&gt;&lt;h1&gt;Hello World&lt;/h1&gt;&lt;/body&gt;"
    },
    {
        c: "HTML Header Tag",
        d: "The &lt;header&gt; tag represents introductory content or navigational aids, typically containing logos, site titles, or navigation menus. It’s a semantic element used to define the top section of a page or article.",
        e: "&lt;header&gt;&lt;nav&gt;Menu&lt;/nav&gt;&lt;/header&gt;"
    },
    {
        c: "HTML Footer Tag",
        d: "The &lt;footer&gt; tag defines the footer section of a page or section, often containing copyright information, contact details, or links. It’s a semantic element for improved accessibility and SEO.",
        e: "&lt;footer&gt;&copy; 2025 My Site&lt;/footer&gt;"
    },
    {
        c: "HTML Main Tag",
        d: "The &lt;main&gt; tag represents the primary content of a document, excluding headers, footers, or sidebars. It enhances accessibility by marking the core content area and should only appear once per page.",
        e: "&lt;main&gt;&lt;article&gt;Content&lt;/article&gt;&lt;/main&gt;"
    },
    {
        c: "HTML Section Tag",
        d: "The &lt;section&gt; tag groups related content, typically with a heading. It’s a semantic element used to organize content thematically, improving document structure and accessibility.",
        e: "&lt;section&gt;&lt;h2&gt;About&lt;/h2&gt;&lt;p&gt;Details&lt;/p&gt;&lt;/section&gt;"
    },
    {
        c: "HTML Article Tag",
        d: "The &lt;article&gt; tag defines independent, self-contained content that can stand alone, such as blog posts or news articles. It’s semantic, aiding accessibility and content syndication.",
        e: "&lt;article&gt;&lt;h2&gt;News&lt;/h2&gt;&lt;p&gt;Story&lt;/p&gt;&lt;/article&gt;"
    },
    {
        c: "HTML Aside Tag",
        d: "The &lt;aside&gt; tag represents content indirectly related to the main content, such as sidebars or callouts. It’s semantic, often used for supplementary information like ads or quotes.",
        e: "&lt;aside&gt;&lt;p&gt;Related Info&lt;/p&gt;&lt;/aside&gt;"
    },
    {
        c: "HTML Nav Tag",
        d: "The &lt;nav&gt; tag defines a section of navigation links, such as menus or breadcrumbs. It’s a semantic element that improves accessibility by marking navigational areas for screen readers.",
        e: "&lt;nav&gt;&lt;ul&gt;&lt;li&gt;&lt;a href=&quot;#&quot;&gt;Home&lt;/a&gt;&lt;/li&gt;&lt;/ul&gt;&lt;/nav&gt;"
    },
    {
        c: "HTML Div Tag",
        d: "The &lt;div&gt; tag is a generic container for grouping elements, primarily used for layout and styling purposes. It’s non-semantic but versatile, often styled with CSS or manipulated with JavaScript.",
        e: "&lt;div class=&quot;container&quot;&gt;Content&lt;/div&gt;"
    },
    {
        c: "HTML Heading Tags",
        d: "The &lt;h1&gt; to &lt;h6&gt; tags define headings, with &lt;h1&gt; being the highest level (main title) and &lt;h6&gt; the lowest. They structure content hierarchically, aiding SEO and accessibility. Proper nesting is critical for document outlines.",
        e: "&lt;h1&gt;Main Title&lt;/h1&gt;&lt;h2&gt;Subtitle&lt;/h2&gt;"
    },
    {
        c: "HTML Address Tag",
        d: "The &lt;address&gt; tag provides contact information for a person, organization, or website, such as email or physical addresses. It’s semantic, often styled in italics by default, and used in footers or articles.",
        e: "&lt;address&gt;contact@example.com&lt;/address&gt;"
    },
    {
        c: "HTML HR Tag",
        d: "The &lt;hr&gt; tag creates a thematic break (horizontal rule) to separate content sections. It’s self-closing, semantic, and can be styled with CSS for visual customization.",
        e: "&lt;hr&gt;"
    },

    // HTML Tags: Text Content
    {
        c: "HTML Paragraph Tag",
        d: "The &lt;p&gt; tag defines a paragraph of text, creating a block-level element with default margins. It’s used for body text and supports inline elements like &lt;strong&gt; or &lt;em&gt; for formatting.",
        e: "&lt;p&gt;This is a paragraph.&lt;/p&gt;"
    },
    {
        c: "HTML Span Tag",
        d: "The &lt;span&gt; tag is an inline container for styling or scripting small portions of text or elements. It’s non-semantic but widely used for applying CSS classes or JavaScript hooks.",
        e: "&lt;span class=&quot;highlight&quot;&gt;Text&lt;/span&gt;"
    },
    {
        c: "HTML Blockquote Tag",
        d: "The &lt;blockquote&gt; tag indicates a long quotation, typically indented by browsers. The 'cite' attribute can specify the source URL, enhancing semantic meaning for accessibility.",
        e: "&lt;blockquote cite=&quot;https://example.com&quot;&gt;Quote text&lt;/blockquote&gt;"
    },
    {
        c: "HTML Pre Tag",
        d: "The &lt;pre&gt; tag displays preformatted text, preserving spaces, tabs, and line breaks. It’s commonly used for code snippets or ASCII art, often paired with &lt;code&gt; for semantics.",
        e: "&lt;pre&gt;  Code\n  Example&lt;/pre&gt;"
    },
    {
        c: "HTML BR Tag",
        d: "The &lt;br&gt; tag inserts a single line break within text. It’s self-closing and used sparingly, as CSS or block elements are preferred for spacing in modern web design.",
        e: "Line one&lt;br&gt;Line two"
    },
    {
        c: "HTML WBR Tag",
        d: "The &lt;wbr&gt; tag suggests an optional word break opportunity, allowing browsers to break long words at appropriate points for better text wrapping. It’s self-closing and semantic.",
        e: "Superlongword&lt;wbr&gt;thatcanbreak"
    },
    {
        c: "HTML B Tag",
        d: "The &lt;b&gt; tag applies bold styling to text without conveying semantic importance (unlike &lt;strong&gt;). It’s used for visual emphasis, such as keywords, and is inline.",
        e: "&lt;b&gt;Bold text&lt;/b&gt;"
    },
    {
        c: "HTML I Tag",
        d: "The &lt;i&gt; tag applies italic styling to text without semantic meaning (unlike &lt;em&gt;). It’s used for visual distinction, such as foreign words or thoughts, and is inline.",
        e: "&lt;i&gt;Italic text&lt;/i&gt;"
    },
    {
        c: "HTML U Tag",
        d: "The &lt;u&gt; tag underlines text without semantic meaning. It’s used for stylistic purposes, such as misspelled words or proper nouns in certain languages, but should be avoided for links to prevent confusion.",
        e: "&lt;u&gt;Underlined text&lt;/u&gt;"
    },
    {
        c: "HTML Em Tag",
        d: "The &lt;em&gt; tag emphasizes text semantically, typically rendered in italics. It conveys stress or importance, aiding accessibility and SEO, and is inline.",
        e: "&lt;em&gt;Emphasized text&lt;/em&gt;"
    },
    {
        c: "HTML Strong Tag",
        d: "The &lt;strong&gt; tag indicates text of strong importance, typically rendered in bold. It’s semantic, enhancing accessibility and SEO, and is inline.",
        e: "&lt;strong&gt;Important text&lt;/strong&gt;"
    },
    {
        c: "HTML Small Tag",
        d: "The &lt;small&gt; tag defines smaller text, often used for fine print, disclaimers, or copyright notices. It’s semantic and inline, with reduced font size by default.",
        e: "&lt;small&gt;Fine print&lt;/small&gt;"
    },
    {
        c: "HTML Mark Tag",
        d: "The &lt;mark&gt; tag highlights text for reference or emphasis, typically with a yellow background. It’s semantic, useful for search results or annotations, and is inline.",
        e: "&lt;mark&gt;Highlighted text&lt;/mark&gt;"
    },
    {
        c: "HTML Abbr Tag",
        d: "The &lt;abbr&gt; tag defines an abbreviation or acronym, with the 'title' attribute providing the full term. It’s semantic, improving accessibility and tooltips on hover.",
        e: "&lt;abbr title=&quot;World Wide Web&quot;&gt;WWW&lt;/abbr&gt;"
    },
    {
        c: "HTML Cite Tag",
        d: "The &lt;cite&gt; tag references a creative work, such as a book, movie, or article title. It’s semantic, often italicized, and used for citations or references.",
        e: "&lt;cite&gt;Moby Dick&lt;/cite&gt;"
    },
    {
        c: "HTML Code Tag",
        d: "The &lt;code&gt; tag represents computer code or programming syntax, typically displayed in a monospace font. It’s semantic, often nested in &lt;pre&gt; for multiline code.",
        e: "&lt;code&gt;console.log(&quot;Hello&quot;);&lt;/code&gt;"
    },
    {
        c: "HTML Dfn Tag",
        d: "The &lt;dfn&gt; tag marks the defining instance of a term, indicating its definition. It’s semantic, often italicized, and used for glossaries or technical documents.",
        e: "&lt;dfn&gt;API&lt;/dfn&gt;: Application Programming Interface"
    },
    {
        c: "HTML Kbd Tag",
        d: "The &lt;kbd&gt; tag represents user input, such as keyboard commands or button presses. It’s semantic, typically monospace, and used in technical documentation.",
        e: "&lt;kbd&gt;Ctrl + C&lt;/kbd&gt;"
    },
    {
        c: "HTML Samp Tag",
        d: "The &lt;samp&gt; tag displays sample output from a program or system, typically in monospace. It’s semantic, used in technical contexts to show expected results.",
        e: "&lt;samp&gt;Error: 404 Not Found&lt;/samp&gt;"
    },
    {
        c: "HTML Var Tag",
        d: "The &lt;var&gt; tag represents a variable in programming or mathematics, typically italicized. It’s semantic, used in technical documents to denote placeholders or identifiers.",
        e: "&lt;var&gt;x&lt;/var&gt; = 5"
    },
    {
        c: "HTML Sub Tag",
        d: "The &lt;sub&gt; tag defines subscript text, such as in chemical formulas (e.g., H₂O). It’s inline, semantic, and reduces font size while lowering text baseline.",
        e: "&lt;sub&gt;2&lt;/sub&gt;"
    },
    {
        c: "HTML Sup Tag",
        d: "The &lt;sup&gt; tag defines superscript text, such as in exponents (e.g., x²). It’s inline, semantic, and reduces font size while raising text baseline.",
        e: "&lt;sup&gt;2&lt;/sup&gt;"
    },
    {
        c: "HTML Q Tag",
        d: "The &lt;q&gt; tag indicates a short inline quotation, typically rendered with quotation marks. The 'cite' attribute can link to the source, enhancing semantics.",
        e: "&lt;q cite=&quot;https://example.com&quot;&gt;Short quote&lt;/q&gt;"
    },
    {
        c: "HTML Bdi Tag",
        d: "The &lt;bdi&gt; tag isolates text with different directional formatting (e.g., mixing left-to-right and right-to-left scripts). It’s semantic, ensuring proper text rendering in multilingual contexts.",
        e: "&lt;bdi&gt;عربي&lt;/bdi&gt; in English text"
    },
    {
        c: "HTML Bdo Tag",
        d: "The &lt;bdo&gt; tag overrides text directionality, forcing left-to-right ('ltr') or right-to-left ('rtl') rendering. It’s semantic, used for controlling bidirectional text display.",
        e: "&lt;bdo dir=&quot;rtl&quot;&gt;Reverse this&lt;/bdo&gt;"
    },
    {
        c: "HTML Time Tag",
        d: "The &lt;time&gt; tag represents a specific time or date, with the 'datetime' attribute providing a machine-readable format. It’s semantic, aiding accessibility and SEO.",
        e: "&lt;time datetime=&quot;2025-06-17&quot;&gt;June 17, 2025&lt;/time&gt;"
    },
    {
        c: "HTML Ruby Tag",
        d: "The &lt;ruby&gt; tag annotates East Asian characters with pronunciation or translation (e.g., furigana in Japanese). It’s semantic, used with &lt;rt&gt; and &lt;rp&gt; for accessibility.",
        e: "&lt;ruby&gt;漢字&lt;rt&gt;kanji&lt;/rt&gt;&lt;/ruby&gt;"
    },
    {
        c: "HTML Rt Tag",
        d: "The &lt;rt&gt; tag provides the annotation text for a &lt;ruby&gt; element, such as pronunciation or translation. It’s semantic, typically displayed above or below the base text.",
        e: "&lt;ruby&gt;漢字&lt;rt&gt;kanji&lt;/rt&gt;&lt;/ruby&gt;"
    },
    {
        c: "HTML Rp Tag",
        d: "The &lt;rp&gt; tag provides fallback parentheses for browsers that don’t support &lt;ruby&gt; annotations. It’s semantic, ensuring compatibility in East Asian text rendering.",
        e: "&lt;ruby&gt;漢字&lt;rp&gt;(&lt;/rp&gt;&lt;rt&gt;kanji&lt;/rt&gt;&lt;rp&gt;)&lt;/rp&gt;&lt;/ruby&gt;"
    },

    // HTML Tags: Lists
    {
        c: "HTML Unordered List Tag",
        d: "The &lt;ul&gt; tag creates an unordered (bulleted) list, containing &lt;li&gt; elements. It’s block-level, semantic, and styled with CSS for custom markers or layouts.",
        e: "&lt;ul&gt;&lt;li&gt;Item 1&lt;/li&gt;&lt;li&gt;Item 2&lt;/li&gt;&lt;/ul&gt;"
    },
    {
        c: "HTML Ordered List Tag",
        d: "The &lt;ol&gt; tag creates an ordered (numbered) list, containing &lt;li&gt; elements. It’s block-level, semantic, with attributes like 'start' or 'type' controlling numbering.",
        e: "&lt;ol type=&quot;A&quot;&gt;&lt;li&gt;Item 1&lt;/li&gt;&lt;li&gt;Item 2&lt;/li&gt;&lt;/ol&gt;"
    },
    {
        c: "HTML List Item Tag",
        d: "The &lt;li&gt; tag defines an item in an ordered list (&lt;ol&gt;) or unordered list (&lt;ul&gt;). It’s semantic, block-level within its parent, and supports global attributes.",
        e: "&lt;li&gt;List item&lt;/li&gt;"
    },
    {
        c: "HTML Description List Tag",
        d: "The &lt;dl&gt; tag defines a description list, containing pairs of &lt;dt&gt; (terms) and &lt;dd&gt; (descriptions). It’s semantic, used for glossaries, metadata, or key-value pairs.",
        e: "&lt;dl&gt;&lt;dt&gt;Term&lt;/dt&gt;&lt;dd&gt;Description&lt;/dd&gt;&lt;/dl&gt;"
    },
    {
        c: "HTML Description Term Tag",
        d: "The &lt;dt&gt; tag specifies a term in a description list (&lt;dl&gt;). It’s semantic, paired with &lt;dd&gt;, and typically displayed as a block-level term.",
        e: "&lt;dt&gt;Term&lt;/dt&gt;"
    },
    {
        c: "Description Tag",
        d: "The &lt;dd&gt; tag provides the description for a term in a description list (&lt;dl&gt;). It’s semantic, typically indented under &lt;dt&gt;, and supports inline or block content.",
        e: "&lt;dd&gt;Details about the term&lt;/dd&gt;"
    },

    // HTML Tags: Links & Navigation
    {
      c: "HTML Anchor Tag",
      d: "The &lt;a&gt; tag creates a hyperlink, enabling navigation to another webpage, file, email, or anchor within the same page. The 'href' attribute specifies the destination URL, while 'target' (e.g., '_blank') controls where the link opens (new tab, same window). Attributes like 'title' add tooltips, and 'rel' (e.g., 'nofollow') informs search engines about link relationships. Critical for web navigation and SEO optimization.",
      e: "&lt;a href=&quot;https://example.com&quot; target=&quot;_blank&quot; title=&quot;Visit Example&quot; rel=&quot;noopener&quot;&gt;Click Here&lt;/a&gt;"
    },
    {
      c: "HTML Area Tag",
      d: "The &lt;area&gt; tag defines a clickable area within an image map (&lt;map&gt;). It’s self-closing, uses attributes like 'shape' (e.g., 'rect', 'circle'), 'coords', and 'href' to create hyperlink regions, and is critical for interactive images.",
      e: "&lt;area shape=&quot;rect&quot; coords=&quot;0,0,100,100&quot; href=&quot;https://example.com&quot;&gt;"
    },
    {
      c: "HTML Map Tag",
      d: "The &lt;map&gt; tag defines an image map, a container for multiple &lt;area&gt; tags to create clickable regions on an image. The 'name' attribute links it to an image via the 'usemap' attribute, enabling complex navigation.",
      e: "&lt;map name=&quot;imagemap&quot;&gt;&lt;area shape=&quot;circle&quot; coords=&quot;50,50,25&quot; href=&quot;#&quot;&gt;&lt;/map&gt;"
    },

    // HTML Tags: Media
    {
      c: "HTML Image Tag",
      d: "The &lt;img&gt; tag embeds an image, using a 'src' attribute for the file path and 'alt' for accessibility text. It’s self-closing, supports attributes like 'loading' (e.g., 'lazy') for performance, and 'width'/'height' for dimensions.",
      e: "&lt;img src=&quot;image.jpg&quot; alt=&quot;Description&quot; loading=&quot;lazy&quot;&gt;"
    },
    {
      c: "HTML Picture Tag",
      d: "The &lt;picture&gt; tag provides multiple image sources for responsive design, using &lt;source&gt; tags to select images based on media queries or formats. It’s semantic, improving performance and accessibility.",
      e: "&lt;picture&gt;&lt;source srcset=&quot;img.webp&quot; type=&quot;image/webp&quot;&gt;&lt;img src=&quot;img.jpg&quot; alt=&quot;Image&quot;&gt;&lt;/picture&gt;"
    },
    {
      c: "HTML Source Tag",
      d: "The &lt;source&gt; tag specifies media resources for &lt;picture&gt;, &lt;audio&gt;, or &lt;video&gt; elements. It’s self-closing, with attributes like 'srcset' for responsive images or 'type' for file formats.",
      e: "&lt;source src=&quot;video.mp4&quot; type=&quot;video/mp4&quot;&gt;"
    },
    {
      c: "HTML Figure Tag",
      d: "The &lt;figure&gt; tag groups media (e.g., images, diagrams) with an optional &lt;figcaption&gt;. It’s semantic, used for self-contained content like illustrations or charts.",
      e: "&lt;figure&gt;&lt;img src=&quot;chart.jpg&quot; alt=&quot;Chart&quot;&gt;&lt;figcaption&gt;Chart Caption&lt;/figcaption&gt;&lt;/figure&gt;"
    },
    {
      c: "HTML Figcaption Tag",
      d: "The &lt;figcaption&gt; tag provides a caption for a &lt;figure&gt; element. It’s semantic, placed before or after the figure’s content, and enhances accessibility.",
      e: "&lt;figcaption&gt;Image Description&lt;/figcaption&gt;"
    },
    {
      c: "HTML Audio Tag",
      d: "The &lt;audio&gt; tag embeds audio files, with attributes like 'controls' for playback UI, 'autoplay', or 'loop'. Multiple &lt;source&gt; tags ensure format compatibility.",
      e: "&lt;audio controls src=&quot;sound.mp3&quot;&gt;&lt;/audio&gt;"
    },
    {
      c: "HTML Video Tag",
      d: "The &lt;video&gt; tag embeds video content, supporting 'controls', 'poster' for a preview image, and 'autoplay'. Multiple &lt;source&gt; tags handle different video formats.",
      e: "&lt;video controls poster=&quot;thumbnail.jpg&quot;&gt;&lt;source src=&quot;video.mp4&quot; type=&quot;video/mp4&quot;&gt;&lt;/video&gt;"
    },
    {
      c: "HTML Track Tag",
      d: "The &lt;track&gt; tag adds subtitles, captions, or descriptions to videos or audio, using 'kind' (e.g., 'subtitles') and 'srclang'. It’s self-closing and enhances accessibility.",
      e: "&lt;track kind=&quot;subtitles&quot; src=&quot;subtitles.vtt&quot; srclang=&quot;en&quot; label=&quot;English&quot;&gt;"
    },
    {
      c: "HTML Embed Tag",
      d: "The &lt;embed&gt; tag embeds external content like multimedia or plugins, with 'src' for the resource and 'type' for its MIME type. It’s self-closing but less common in modern HTML.",
      e: "&lt;embed src=&quot;file.swf&quot; type=&quot;application/x-shockwave-flash&quot;&gt;"
    },
    {
      c: "HTML Object Tag",
      d: "The &lt;object&gt; tag embeds external resources like PDFs or multimedia, with 'data' for the resource and 'type' for MIME type. It’s more flexible than &lt;embed&gt;.",
      e: "&lt;object data=&quot;file.pdf&quot; type=&quot;application/pdf&quot;&gt;&lt;/object&gt;"
    },
    {
      c: "HTML Iframe Tag",
      d: "The &lt;iframe&gt; tag embeds another HTML document within the current page, using 'src' for the URL. Attributes like 'sandbox' or 'allow' control security and permissions.",
      e: "&lt;iframe src=&quot;https://example.com&quot; title=&quot;Embedded Page&quot;&gt;&lt;/iframe&gt;"
    },
    {
      c: "HTML Canvas Tag",
      d: "The &lt;canvas&gt; tag creates a drawable surface for JavaScript rendering, used for 2D/3D graphics, animations, or games. It requires 'width' and 'height' attributes.",
      e: "&lt;canvas id=&quot;myCanvas&quot; width=&quot;200&quot; height=&quot;200&quot;&gt;&lt;/canvas&gt;"
    },
    {
      c: "HTML Svg Tag",
      d: "The &lt;svg&gt; tag embeds scalable vector graphics, allowing inline SVG shapes, paths, or animations. It’s resolution-independent, ideal for interactive graphics.",
      e: "&lt;svg width=&quot;100&quot; height=&quot;100&quot;&gt;&lt;circle cx=&quot;50&quot; cy=&quot;50&quot; r=&quot;40&quot; fill=&quot;red&quot;&gt;&lt;/circle&gt;&lt;/svg&gt;"
    },

    // HTML Tags: Tables
    {
      c: "HTML Table Tag",
      d: "The &lt;table&gt; tag creates a table for data organization, containing &lt;tr&gt;, &lt;th&gt;, and &lt;td&gt; elements. It’s semantic; attributes like 'border' or 'scope' enhance accessibility.",
      e: "&lt;table&gt;&lt;tr&gt;&lt;th&gt;Header&lt;/th&gt;&lt;td&gt;Data&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;"
    },
    {
      c: "HTML Caption Tag",
      d: "The &lt;caption&gt; tag adds a title or description to a table, placed immediately after &lt;table&gt;. It’s semantic, improving accessibility for screen readers.",
      e: "&lt;caption&gt;Table of Results&lt;/caption&gt;"
    },
    {
      c: "HTML Table Header Section",
      d: "The &lt;thead&gt; tag groups header rows in a table, typically containing &lt;tr&gt; and &lt;th&gt; elements. It’s semantic, used for styling or scripting.",
      e: "&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Column&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;"
    },
    {
      c: "HTML Table Body Section",
      d: "The &lt;tbody&gt; tag groups the main content rows in a table, containing &lt;tr&gt; and &lt;td&gt; elements. It’s semantic, separating data from headers or footers.",
      e: "&lt;tbody&gt;&lt;tr&gt;&lt;td&gt;Data&lt;/td&gt;&lt;/tr&gt;&lt;/tbody&gt;"
    },
    {
      c: "HTML Table Footer Section",
      d: "The &lt;tfoot&gt; tag groups footer rows in a table, often for summaries or totals. It’s semantic, containing &lt;tr&gt; and &lt;td&gt; or &lt;th&gt; elements.",
      e: "&lt;tfoot&gt;&lt;tr&gt;&lt;td&gt;Total&lt;/td&gt;&lt;/tr&gt;&lt;/tfoot&gt;"
    },
    {
      c: "HTML Table Row Tag",
      d: "The &lt;tr&gt; tag defines a row in a table, containing &lt;th&gt; or &lt;td&gt; cells. It’s semantic, forming the table’s grid structure.",
      e: "&lt;tr&gt;&lt;td&gt;Cell&lt;/td&gt;&lt;/tr&gt;"
    },
    {
      c: "HTML Table Data Cell Tag",
      d: "The &lt;td&gt; tag defines a data cell in a table row. It supports attributes like 'colspan' or 'rowspan' for spanning multiple rows or columns.",
      e: "&lt;td colspan=&quot;2&quot;&gt;Data&lt;/td&gt;"
    },
    {
      c: "HTML Table Header Cell Tag",
      d: "The &lt;th&gt; tag defines a header cell in a table, typically bold and centered. The 'scope' attribute (e.g., 'col', 'row') enhances accessibility.",
      e: "&lt;th scope=&quot;col&quot;&gt;Header&lt;/th&gt;"
    },
    {
      c: "HTML Colgroup Tag",
      d: "The &lt;colgroup&gt; tag groups columns in a table for styling or formatting, containing &lt;col&gt; elements. It’s placed before &lt;thead&gt; or &lt;tbody&gt;.",
      e: "&lt;colgroup&gt;&lt;col span=&quot;2&quot; style=&quot;background-color: #f0f0f0;&quot;&gt;&lt;/colgroup&gt;"
    },
    {
      c: "HTML Col Tag",
      d: "The &lt;col&gt; tag specifies properties for one or more table columns within a &lt;colgroup&gt;. It’s self-closing and uses attributes like 'span' or 'width'.",
      e: "&lt;col span=&quot;1&quot; style=&quot;width: 100px;&quot;&gt;"
    },

    // HTML Tags: Forms & Input
    {
      c: "HTML Form Tag",
      d: "The &lt;form&gt; tag creates a container for user input elements like &lt;input&gt; or &lt;button&gt;. Attributes like 'action' (URL), 'method' (e.g., 'POST'), and 'autocomplete' control form behavior.",
      e: "&lt;form action=&quot;/submit&quot; method=&quot;POST&quot;&gt;&lt;input type=&quot;text&quot; name=&quot;username&quot;&gt;&lt;/form&gt;"
    },
    {
      c: "HTML Input Tag",
      d: "The &lt;input&gt; tag creates interactive controls (e.g., text fields, checkboxes) based on the 'type' attribute. Attributes like 'name', 'value', or 'required' define behavior and validation.",
      e: "&lt;input type=&quot;email&quot; name=&quot;email&quot; required placeholder=&quot;Enter email&quot;&gt;"
    },
    {
      c: "HTML Textarea Tag",
      d: "The &lt;textarea&gt; tag creates a multiline text input field. Attributes like 'rows', 'cols', or 'maxlength' control size and input limits, and it supports 'placeholder' for hints.",
      e: "&lt;textarea rows=&quot;4&quot; cols=&quot;50&quot; placeholder=&quot;Enter message&quot;&gt;&lt;/textarea&gt;"
    },
    {
      c: "HTML Button Tag",
      d: "The &lt;button&gt; tag defines a clickable button for actions like form submission or JavaScript triggers. The 'type' attribute (e.g., 'submit', 'button', or 'reset') defines behavior, and it’s customizable with CSS.",
      e: "&lt;button type=&quot;submit&quot;&gt;Submit&lt;/button&gt;"
    },
    {
      c: "HTML Select Tag",
      d: "The &lt;select&gt; tag creates a dropdown menu, containing &lt;option&gt; elements. Attributes like 'multiple' or 'name' control selection behavior, and it’s semantic.",
      e: "&lt;select name=&quot;options&quot;&gt;&lt;option value=&quot;1&quot;&gt;Option 1&lt;/option&gt;&lt;/select&gt;"
    },
    {
      c: "HTML Option Tag",
      d: "The &lt;option&gt; tag defines an item in a &lt;select&gt; or &lt;datalist&gt;. Attributes like 'value', 'selected', or 'disabled' control its state and data.",
      e: "&lt;option value=&quot;value&quot; selected&gt;Choice&lt;/option&gt;"
    },
    {
      c: "HTML Optgroup Tag",
      d: "The &lt;optgroup&gt; tag groups related &lt;option&gt; elements in a &lt;select&gt; dropdown, with a 'label' attribute for the group name. It’s semantic for organizing menus.",
      e: "&lt;optgroup label=&quot;Group&quot;&gt;&lt;option&gt;Item&lt;/option&gt;&lt;/optgroup&gt;"
    },
    {
      c: "HTML Label Tag",
      d: "The &lt;label&gt; tag associates text with a form control, improving accessibility. The 'for' attribute links to an input’s 'id', enabling click-to-activate functionality.",
      e: "&lt;label for=&quot;input-id&quot;&gt;Label Text&lt;/label&gt;"
    },
    {
      c: "HTML Fieldset Tag",
      d: "The &lt;fieldset&gt; tag groups related form elements, often with a &lt;legend&gt; for a title. It’s semantic, used for organizing complex forms, and supports 'disabled' for conditional behavior.",
      e: "&lt;fieldset&gt;&lt;legend&gt;Group&lt;/legend&gt;&lt;input type=&quot;text&quot;&gt;&lt;/fieldset&gt;"
    },
    {
      c: "HTML Legend Tag",
      d: "The &lt;legend&gt; tag provides a caption for a &lt;fieldset&gt;, describing the group’s purpose. It’s semantic and typically styled as a title within the fieldset border.",
      e: "&lt;legend&gt;Form Section&lt;/legend&gt;"
    },
    {
      c: "HTML Datalist Tag",
      d: "The &lt;datalist&gt; tag provides an autocomplete list for an &lt;input&gt; field, containing &lt;option&gt; elements. It’s linked via the 'list' attribute, enhancing user input suggestions.",
      e: "&lt;datalist id=&quot;suggestions&quot;&gt;&lt;option value=&quot;Item&quot;&gt;&lt;/datalist&gt;&lt;input list=&quot;suggestions&quot;&gt;"
    },
    {
      c: "HTML Output Tag",
      d: "The &lt;output&gt; tag displays the result of a form calculation or user action, often updated via JavaScript. It’s semantic, with the 'for' attribute linking to input IDs.",
      e: "&lt;output for=&quot;range&quot;&gt;Result&lt;/output&gt;"
    },
    {
      c: "HTML Meter Tag",
      d: "The &lt;meter&gt; tag represents a scalar value within a range, e.g., progress or gauge (e.g., disk usage). Attributes like 'value', 'high', or 'low' define thresholds, and it’s semantic.",
      e: "&lt;meter value=&quot;70&quot; min=&quot;0&quot; max=&quot;100&quot;&gt;70%&lt;/meter&gt;"
    },
    {
      c: "HTML Progress Tag",
      d: "The &lt;progress&gt; tag shows task completion status, with 'value' and 'max' attributes defining progress. It’s semantic, used for loading bars or task trackers.",
      e: "&lt;progress value=&quot;50&quot; max=&quot;100&quot;&gt;50%&lt;/progress&gt;"
    },

    // HTML Tags: Scripting & Templates
    {
      c: "HTML Template Tag",
      d: "The &lt;template&gt; tag stores reusable HTML content that’s not rendered until activated via JavaScript. It’s semantic, ideal for dynamic content like UI components.",
      e: "&lt;template id=&quot;my-template&quot;&gt;&lt;div&gt;Content&lt;/div&gt;&lt;/template&gt;"
    },
    {
      c: "HTML Slot Tag",
      d: "The &lt;slot&gt; tag defines a placeholder in a &lt;template&gt; or web components for injecting content via shadow DOM. It’s semantic, enabling modular component design.",
      e: "&lt;slot name=&quot;content&quot;&gt;Default&lt;/slot&gt;"
    },

    // HTML Tags: Interactive Elements
    {
      c: "HTML Details Tag",
      d: "The &lt;details&gt; tag creates a collapsible section, revealing content when toggled. It’s semantic, with the 'open' attribute controlling default visibility, often paired with &lt;summary&gt;.",
      e: "&lt;details&gt;&lt;summary&gt;Click to expand&lt;/summary&gt;Details&lt;/details&gt;"
    },
    {
      c: "HTML Summary Tag",
      d: "The &lt;summary&gt; tag provides a clickable heading for a &lt;details&gt; element, summarizing the collapsible content. It’s semantic, enhancing interactive accessibility.",
      e: "&lt;summary&gt;Toggle&lt;/summary&gt;"
    },
    {
      c: "HTML Dialog Tag",
      d: "The &lt;dialog&gt; tag creates a native dialog box or modal, controlled via JavaScript methods like 'showModal()'. It’s semantic, used for pop-ups or alerts.",
      e: "&lt;dialog id=&quot;modal&quot;&gt;&lt;p&gt;Message&lt;/p&gt;&lt;/dialog&gt;"
    },
    {
      c: "HTML Menu Tag",
      d: "The &lt;menu&gt; tag defines a list of commands, typically for context menus. It’s semantic but rarely used in modern web design, containing &lt;li&gt; or &lt;menuitem&gt; (deprecated).",
      e: "&lt;menu&gt;&lt;li&gt;Option&lt;/li&gt;&lt;/menu&gt;"
    },

    // HTML Attributes: Form Attributes
    {
        c: "HTML autocomplete Attribute",
        d: "The autocomplete attribute enables or disables browser autofill for form elements, with values like &quot;on&quot;, &quot;off&quot;, or specific hints (e.g., &quot;email&quot;). It enhances UX.",
        e: "&lt;input autocomplete=&quot;email&quot;&gt;"
    },
    {
        c: "HTML enctype Attribute",
        d: "The enctype attribute specifies how form data is encoded for submission, with values like &quot;multipart/form-data&quot; for file uploads. It’s used with POST forms.",
        e: "&lt;form enctype=&quot;multipart/form-data&quot;&gt;&lt;/form&gt;"
    },
    {
        c: "HTML novalidate Attribute",
        d: "The novalidate attribute disables native form validation, allowing custom validation via JavaScript. It’s boolean and used on &lt;form&gt; elements.",
        e: "&lt;form novalidate&gt;&lt;input required&gt;&lt;/form&gt;"
    },
    {
        c: "HTML accept-charset Attribute",
        d: "The accept-charset attribute specifies the character encodings for form submission, like &quot;UTF-8&quot;. It’s rarely used as UTF-8 is default in modern browsers.",
        e: "&lt;form accept-charset=&quot;UTF-8&quot;&gt;&lt;/form&gt;"
    },
    {
        c: "HTML rel Attribute",
        d: "The rel attribute defines the relationship between a linked resource and the document, used in &lt;form&gt; or &lt;a&gt; (e.g., &quot;nofollow&quot;, &quot;noopener&quot;). It’s critical for SEO and security.",
        e: "&lt;a rel=&quot;nofollow&quot; href=&quot;link&quot;&gt;Link&lt;/a&gt;"
    },

    // HTML Attributes: Input-Specific Attributes
    {
        c: "HTML accept Attribute",
        d: "The accept attribute specifies allowed file types for &lt;input type=&quot;file&quot;&gt;, using MIME types or extensions (e.g., &quot;image/*&quot;). It improves file upload UX.",
        e: "&lt;input type=&quot;file&quot; accept=&quot;.pdf,image/*&quot;&gt;"
    },
    {
        c: "HTML alt Attribute",
        d: "The alt attribute provides alternative text for &lt;img&gt; or &lt;area&gt; elements, used by screen readers and displayed if the image fails to load. It’s critical for accessibility.",
        e: "&lt;img src=&quot;img.jpg&quot; alt=&quot;Description&quot;&gt;"
    },
    {
        c: "HTML checked Attribute",
        d: "The checked attribute sets a checkbox or radio input as selected by default. It’s boolean and used for form pre-selection.",
        e: "&lt;input type=&quot;checkbox&quot; checked&gt;"
    },
    {
        c: "HTML disabled Attribute",
        d: "The disabled attribute prevents user interaction with form elements, rendering them grayed out. It’s boolean and used for conditional form states.",
        e: "&lt;input type=&quot;text&quot; disabled&gt;"
    },
    {
        c: "HTML form Attribute",
        d: "The form attribute links an input to a &lt;form&gt; by its ID, allowing inputs outside the form element to be included in submission.",
        e: "&lt;input form=&quot;myForm&quot;&gt;&lt;form id=&quot;myForm&quot;&gt;&lt;/form&gt;"
    },
    {
        c: "HTML formaction Attribute",
        d: "The formaction attribute overrides a form’s action URL for a specific &lt;input&gt; or &lt;button&gt; of type &quot;submit&quot;. It’s used for multiple submission endpoints.",
        e: "&lt;button formaction=&quot;/save&quot;&gt;Save&lt;/button&gt;"
    },
    {
        c: "HTML max Attribute",
        d: "The max attribute sets the maximum value for numeric inputs (e.g., number, range). It’s used for form validation and constraints.",
        e: "&lt;input type=&quot;number&quot; max=&quot;100&quot;&gt;"
    },
    {
        c: "HTML maxlength Attribute",
        d: "The maxlength attribute limits the number of characters in text inputs or textareas. It’s used for input validation and UX.",
        e: "&lt;input type=&quot;text&quot; maxlength=&quot;50&quot;&gt;"
    },
    {
        c: "HTML min Attribute",
        d: "The min attribute sets the minimum value for numeric inputs. It works with max for range constraints in form validation.",
        e: "&lt;input type=&quot;number&quot; min=&quot;0&quot;&gt;"
    },
    {
        c: "HTML multiple Attribute",
        d: "The multiple attribute allows selecting multiple options in a &lt;select&gt; or file input. It’s boolean and enhances form flexibility.",
        e: "&lt;select multiple&gt;&lt;option&gt;Item&lt;/option&gt;&lt;/select&gt;"
    },
    {
        c: "HTML name Attribute",
        d: "The name attribute assigns a key for form data submission, used in &lt;input&gt;, &lt;select&gt;, or &lt;form&gt;. It’s essential for server-side processing.",
        e: "&lt;input name=&quot;username&quot;&gt;"
    },
    {
        c: "HTML pattern Attribute",
        d: "The pattern attribute specifies a regular expression for validating text input. It’s used with &lt;input&gt; for client-side validation.",
        e: "&lt;input type=&quot;text&quot; pattern=&quot;[A-Za-z]{3,}&quot;&gt;"
    },
    {
        c: "HTML readonly Attribute",
        d: "The readonly attribute prevents user modification of an input’s value, while still allowing submission. It’s boolean and used for display-only fields.",
        e: "&lt;input type=&quot;text&quot; readonly value=&quot;Fixed&quot;&gt;"
    },
    {
        c: "HTML size Attribute",
        d: "The size attribute sets the visible width of &lt;input&gt; or &lt;select&gt; elements, in characters or options. It affects display but not functionality.",
        e: "&lt;input type=&quot;text&quot; size=&quot;20&quot;&gt;"
    },
    {
        c: "HTML src Attribute",
        d: "The src attribute specifies the resource URL for &lt;img&gt;, &lt;script&gt;, &lt;iframe&gt;, or &lt;input&gt; elements. It’s critical for embedding external content.",
        e: "&lt;img src=&quot;image.jpg&quot;&gt;"
    },
    {
        c: "HTML step Attribute",
        d: "The step attribute defines the increment for numeric inputs (e.g., number, range). It’s used with min and max for precise control.",
        e: "&lt;input type=&quot;number&quot; step=&quot;0.1&quot;&gt;"
    },
    {
        c: "HTML type Attribute",
        d: "The type attribute specifies the input type (e.g., &quot;text&quot;, &quot;email&quot;, &quot;submit&quot;) for &lt;input&gt; or &lt;button&gt;. It defines behavior and validation.",
        e: "&lt;input type=&quot;email&quot;&gt;"
    },
    {
        c: "HTML value Attribute",
        d: "The value attribute sets the default or current value of an &lt;input&gt;, &lt;option&gt;, or &lt;button&gt;. It’s used for form initialization or submission data.",
        e: "&lt;input type=&quot;text&quot; value=&quot;Default&quot;&gt;"
    },
    {
        c: "HTML width Attribute",
        d: "The width attribute sets the width of &lt;img&gt;, &lt;canvas&gt;, or &lt;input&gt; elements, in pixels. It’s used for layout but often overridden by CSS.",
        e: "&lt;img width=&quot;200&quot; src=&quot;img.jpg&quot;&gt;"
    },

    // HTML Attributes: Media Attributes
    {
        c: "HTML loop Attribute",
        d: "The loop attribute enables continuous playback of &lt;audio&gt; or &lt;video&gt; elements. It’s boolean and used for repeating media.",
        e: "&lt;video loop&gt;&lt;source src=&quot;video.mp4&quot;&gt;&lt;/video&gt;"
    },
    {
        c: "HTML muted Attribute",
        d: "The muted attribute silences &lt;audio&gt; or &lt;video&gt; playback by default. It’s boolean and used for user-friendly media initialization.",
        e: "&lt;video muted&gt;&lt;source src=&quot;video.mp4&quot;&gt;&lt;/video&gt;"
    },
    {
        c: "HTML preload Attribute",
        d: "The preload attribute hints at how &lt;audio&gt; or &lt;video&gt; should load, with values like &quot;auto&quot;, &quot;metadata&quot;, or &quot;none&quot;. It optimizes performance.",
        e: "&lt;video preload=&quot;metadata&quot;&gt;&lt;source src=&quot;video.mp4&quot;&gt;&lt;/video&gt;"
    },
    {
        c: "HTML poster Attribute",
        d: "The poster attribute specifies an image to display before a &lt;video&gt; plays. It enhances UX by providing a visual preview.",
        e: "&lt;video poster=&quot;thumbnail.jpg&quot;&gt;&lt;source src=&quot;video.mp4&quot;&gt;&lt;/video&gt;"
    },
    {
        c: "HTML crossorigin Attribute",
        d: "The crossorigin attribute specifies CORS settings for &lt;img&gt;, &lt;script&gt;, or &lt;video&gt;, with values like &quot;anonymous&quot; or &quot;use-credentials&quot;. It’s used for cross-origin resources.",
        e: "&lt;img crossorigin=&quot;anonymous&quot; src=&quot;img.jpg&quot;&gt;"
    },

    // HTML Attributes: Table Attributes
    {
        c: "HTML colspan Attribute",
        d: "The colspan attribute specifies how many columns a &lt;td&gt; or &lt;th&gt; spans in a table. It’s used for merging cells horizontally.",
        e: "&lt;td colspan=&quot;2&quot;&gt;Spanning cell&lt;/td&gt;"
    },
    {
        c: "HTML rowspan Attribute",
        d: "The rowspan attribute specifies how many rows a &lt;td&gt; or &lt;th&gt; spans in a table. It’s used for merging cells vertically.",
        e: "&lt;td rowspan=&quot;2&quot;&gt;Spanning cell&lt;/td&gt;"
    },
    {
        c: "HTML headers Attribute",
        d: "The headers attribute links a &lt;td&gt; or &lt;th&gt; to header cells via their IDs, enhancing table accessibility for screen readers.",
        e: "&lt;td headers=&quot;header1&quot;&gt;Data&lt;/td&gt;"
    },
    {
        c: "HTML scope Attribute",
        d: "The scope attribute defines the scope of a &lt;th&gt; cell, with values like &quot;row&quot;, &quot;col&quot;, or &quot;rowgroup&quot;. It’s critical for accessible tables.",
        e: "&lt;th scope=&quot;col&quot;&gt;Header&lt;/th&gt;"
    },

    // HTML Attributes: Anchor & Link Attributes
    {
        c: "HTML download Attribute",
        d: "The download attribute prompts a file download when a link is clicked, optionally specifying a filename. It’s used with &lt;a&gt; or &lt;area&gt;.",
        e: "&lt;a href=&quot;file.pdf&quot; download=&quot;document.pdf&quot;&gt;Download&lt;/a&gt;"
    },
    {
        c: "HTML hreflang Attribute",
        d: "The hreflang attribute specifies the language of a linked resource, used in &lt;a&gt; or &lt;link&gt; for SEO and accessibility.",
        e: "&lt;a hreflang=&quot;es&quot; href=&quot;page-es.html&quot;&gt;Spanish&lt;/a&gt;"
    },
    {
        c: "HTML referrerpolicy Attribute",
        d: "The referrerpolicy attribute controls referrer information sent with requests, with values like &quot;no-referrer&quot; or &quot;origin&quot;. It’s used for privacy and security.",
        e: "&lt;a href=&quot;link&quot; referrerpolicy=&quot;no-referrer&quot;&gt;Link&lt;/a&gt;"
    },

    // HTML Attributes: Image Attributes
    {
        c: "HTML loading Attribute",
        d: "The loading attribute controls image or iframe loading, with values &quot;lazy&quot; or &quot;eager&quot;. Lazy loading improves performance by deferring off-screen content.",
        e: "&lt;img src=&quot;img.jpg&quot; loading=&quot;lazy&quot;&gt;"
    },
    {
        c: "HTML decoding Attribute",
        d: "The decoding attribute hints at image decoding, with values &quot;sync&quot;, &quot;async&quot;, or &quot;auto&quot;. It optimizes rendering performance.",
        e: "&lt;img src=&quot;img.jpg&quot; decoding=&quot;async&quot;&gt;"
    },
    {
        c: "HTML usemap Attribute",
        d: "The usemap attribute links an &lt;img&gt; to a &lt;map&gt; element by name, enabling clickable image maps.",
        e: "&lt;img src=&quot;img.jpg&quot; usemap=&quot;#mapname&quot;&gt;"
    },
    {
        c: "HTML ismap Attribute",
        d: "The ismap attribute indicates an &lt;img&gt; is part of a server-side image map, sending click coordinates to the server. It’s used with &lt;a&gt;.",
        e: "&lt;img src=&quot;img.jpg&quot; ismap&gt;"
    },

    // HTML Attributes: Script & Style Attributes
    {
        c: "HTML async Attribute",
        d: "The async attribute allows asynchronous loading of &lt;script&gt; files, executing them as soon as they’re ready. It’s used for non-blocking scripts.",
        e: "&lt;script src=&quot;script.js&quot; async&gt;&lt;/script&gt;"
    },
    {
        c: "HTML defer Attribute",
        d: "The defer attribute delays &lt;script&gt; execution until the DOM is fully parsed, maintaining order. It’s used for performance optimization.",
        e: "&lt;script src=&quot;script.js&quot; defer&gt;&lt;/script&gt;"
    },
    {
        c: "HTML integrity Attribute",
        d: "The integrity attribute verifies a &lt;script&gt; or &lt;link&gt; resource’s integrity using a cryptographic hash, ensuring security for external resources.",
        e: "&lt;script src=&quot;script.js&quot; integrity=&quot;sha256-xyz&quot;&gt;&lt;/script&gt;"
    },
    {
        c: "HTML media Attribute",
        d: "The media attribute specifies the media query for a &lt;link&gt; or &lt;style&gt;, applying styles conditionally (e.g., &quot;print&quot;, &quot;screen&quot;).",
        e: "&lt;link rel=&quot;stylesheet&quot; media=&quot;print&quot; href=&quot;print.css&quot;&gt;"
    },

    // HTML Attributes: Accessibility & ARIA
    {
        c: "HTML aria-hidden Attribute",
        d: "The aria-hidden attribute indicates whether an element is visible to assistive technologies, with values &quot;true&quot; or &quot;false&quot;. It’s used to hide decorative content.",
        e: "&lt;div aria-hidden=&quot;true&quot;&gt;Decorative&lt;/div&gt;"
    },
    {
        c: "HTML aria-checked Attribute",
        d: "The aria-checked attribute indicates the checked state of a custom checkbox or radio button, with values &quot;true&quot;, &quot;false&quot;, or &quot;mixed&quot;. It’s used for ARIA roles.",
        e: "&lt;div role=&quot;checkbox&quot; aria-checked=&quot;true&quot;&gt;Checked&lt;/div&gt;"
    },
    {
        c: "HTML aria-expanded Attribute",
        d: "The aria-expanded attribute indicates whether a collapsible element is expanded, with values &quot;true&quot; or &quot;false&quot;. It’s critical for accessible menus or accordions.",
        e: "&lt;button aria-expanded=&quot;false&quot;&gt;Toggle&lt;/button&gt;"
    },

    // JavaScript: Keywords & Declarations (continued)
    {
        c: "JavaScript else Keyword",
        d: "The else keyword specifies an alternative block of code to execute when an if condition is false. It’s used for conditional branching.",
        e: "if (x &lt; 0) { console.log('Negative'); } else { console.log('Non-negative'); }"
    },
    {
        c: "JavaScript switch Keyword",
        d: "The switch keyword evaluates an expression and executes code based on matching cases. It’s used for multi-branch control flow, often with break.",
        e: "switch (day) { case 1: console.log('Monday'); break; default: console.log('Other'); }"
    },
    {
        c: "JavaScript case Keyword",
        d: "The case keyword defines a value to match in a switch statement, executing associated code if matched. It’s paired with break or return.",
        e: "case 'red': console.log('Color red'); break;"
    },
    {
        c: "JavaScript default Keyword",
        d: "The default keyword specifies the code to run in a switch statement when no case matches. It’s optional and typically placed last.",
        e: "default: console.log('No match');"
    },
    {
        c: "JavaScript break Keyword",
        d: "The break keyword exits a loop or switch statement, preventing further iterations or case execution. It’s critical for control flow.",
        e: "for (let i = 0; i &lt; 5; i++) { if (i === 3) break; console.log(i); }"
    },
    {
        c: "JavaScript continue Keyword",
        d: "The continue keyword skips the current loop iteration and proceeds to the next. It’s used to bypass specific conditions in loops.",
        e: "for (let i = 0; i &lt; 5; i++) { if (i === 2) continue; console.log(i); }"
    },
    {
        c: "JavaScript for Keyword",
        d: "The for keyword creates a loop with initialization, condition, and increment expressions. It’s used for iterating over sequences or arrays.",
        e: "for (let i = 0; i &lt; 5; i++) { console.log(i); }"
    },
    {
        c: "JavaScript while Keyword",
        d: "The while keyword creates a loop that runs as long as a condition is true. It’s used for indefinite iteration.",
        e: "while (x &gt; 0) { console.log(x); x--; }"
    },
    {
        c: "JavaScript do Keyword",
        d: "The do keyword starts a do-while loop, executing at least once before checking the condition. It’s used for guaranteed initial execution.",
        e: "do { console.log(x); x--; } while (x &gt; 0);"
    },
    {
        c: "JavaScript try Keyword",
        d: "The try keyword defines a block of code to test for errors, paired with catch or finally for error handling. It’s critical for robust code.",
        e: "try { riskyCode(); } catch (e) { console.error(e); }"
    },
    {
        c: "JavaScript catch Keyword",
        d: "The catch keyword handles errors thrown in a try block, capturing the error object. It’s used for graceful error recovery.",
        e: "catch (error) { console.error('Error:', error.message); }"
    },
    {
        c: "JavaScript finally Keyword",
        d: "The finally keyword executes code after try/catch, regardless of errors. It’s used for cleanup or guaranteed execution.",
        e: "finally { console.log('Cleanup'); }"
    },
    {
        c: "JavaScript throw Keyword",
        d: "The throw keyword creates a custom error, halting execution unless caught. It’s used for manual error handling.",
        e: "if (!data) throw new Error('No data');"
    },
    {
        c: "JavaScript new Keyword",
        d: "The new keyword creates an instance of a constructor function or class. It’s used for object creation, like Date or custom objects.",
        e: "let date = new Date();"
    },
    {
        c: "JavaScript this Keyword",
        d: "The this keyword refers to the current execution context, often the object owning the method. Its value depends on how a function is called.",
        e: "let obj = { name: 'Test', getName() { return this.name; } };"
    },
    {
        c: "JavaScript typeof Keyword",
        d: "The typeof operator returns a string indicating the type of a value (e.g., &quot;string&quot;, &quot;object&quot;). It’s used for type checking.",
        e: "console.log(typeof 42); // 'number'"
    },
    {
        c: "JavaScript instanceof Keyword",
        d: "The instanceof operator checks if an object is an instance of a constructor or class. It’s used for type verification.",
        e: "let date = new Date(); console.log(date instanceof Date); // true"
    },
    {
        c: "JavaScript in Keyword",
        d: "The in operator checks if a property exists in an object or array. It’s used for property enumeration or validation.",
        e: "let obj = { a: 1 }; console.log('a' in obj); // true"
    },
    {
        c: "JavaScript delete Keyword",
        d: "The delete operator removes a property from an object or an array element. It’s used for dynamic object modification.",
        e: "let obj = { a: 1 }; delete obj.a;"
    },
    {
        c: "JavaScript void Keyword",
        d: "The void operator evaluates an expression and returns undefined. It’s rarely used, often in href attributes for no-op links.",
        e: "&lt;a href=&quot;javascript:void(0)&quot;&gt;No action&lt;/a&gt;"
    },
    {
        c: "JavaScript await Keyword",
        d: "The await keyword pauses an async function until a Promise resolves, simplifying asynchronous code. It’s only valid inside async functions.",
        e: "async function getData() { let data = await fetch('url'); }"
    },
    {
        c: "JavaScript yield Keyword",
        d: "The yield keyword pauses a generator function, returning a value to the caller. It’s used for iterative or lazy evaluation.",
        e: "function* gen() { yield 1; yield 2; }"
    },
    {
        c: "JavaScript import Keyword",
        d: "The import keyword loads modules or specific exports from another file. It’s used in ES modules for modular code.",
        e: "import { func } from './module.js';"
    },
    {
        c: "JavaScript export Keyword",
        d: "The export keyword makes variables, functions, or classes available for import in other files. It supports default or named exports.",
        e: "export function add(a, b) { return a + b; }"
    },
    {
        c: "JavaScript class Keyword",
        d: "The class keyword defines a blueprint for creating objects with shared properties and methods. It’s syntactic sugar for constructor functions.",
        e: "class Person { constructor(name) { this.name = name; } }"
    },
    {
        c: "JavaScript extends Keyword",
        d: "The extends keyword creates a subclass that inherits from a parent class. It’s used for class-based inheritance in JavaScript.",
        e: "class Student extends Person { study() { console.log('Studying'); } }"
    },
    {
        c: "JavaScript super Keyword",
        d: "The super keyword calls the parent class’s constructor or methods in a subclass. It’s used for inheritance and method overriding.",
        e: "class Student extends Person { constructor(name) { super(name); } }"
    },
    {
        c: "JavaScript static Keyword",
        d: "The static keyword defines methods or properties on a class itself, not its instances. It’s used for utility or shared functionality.",
        e: "class MathUtils { static add(a, b) { return a + b; } }"
    },
    {
        c: "JavaScript with Keyword",
        d: "The with keyword adds an object to the scope chain, allowing direct property access. It’s deprecated due to ambiguity and performance issues.",
        e: "with (obj) { console.log(name); } // Avoid usage"
    },
    {
        c: "JavaScript debugger Keyword",
        d: "The debugger keyword pauses execution and triggers the browser’s debugger, if active. It’s used for development and debugging.",
        e: "function test() { debugger; console.log('Paused'); }"
    },

    // JavaScript: Data Types
    {
        c: "JavaScript boolean Type",
        d: "The boolean type represents true or false values, used for conditional logic and comparisons. It’s a primitive type with associated Boolean object.",
        e: "let isActive = true;"
    },
    {
        c: "JavaScript null Type",
        d: "The null type represents an intentional absence of value. It’s a primitive type, distinct from undefined, used for clearing variables.",
        e: "let value = null;"
    },
    {
        c: "JavaScript undefined Type",
        d: "The undefined type indicates an uninitialized or missing value. It’s a primitive type, automatically assigned to undeclared variables.",
        e: "let value; console.log(value); // undefined"
    },
    {
        c: "JavaScript symbol Type",
        d: "The symbol type creates unique, immutable identifiers, often used as object keys to avoid property collisions. It’s a primitive introduced in ES6.",
        e: "let id = Symbol('id');"
    },
    {
        c: "JavaScript bigint Type",
        d: "The bigint type represents integers of arbitrary length, beyond the Number type’s safe integer limit. It’s used for large numeric calculations.",
        e: "let bigNum = 12345678901234567890n;"
    },
    {
        c: "JavaScript array Type",
        d: "The array type is an ordered list of values, created with Array or [] syntax. It supports methods like push() or map() for data manipulation.",
        e: "let arr = [1, 2, 3];"
    },
    {
        c: "JavaScript function Type",
        d: "The function type represents executable code blocks, created with function declarations or expressions. It’s a core building block of JavaScript.",
        e: "let fn = function() { console.log('Hello'); };"
    },
    {
        c: "JavaScript date Type",
        d: "The date type represents dates and times, created with the Date constructor. It provides methods for manipulation and formatting.",
        e: "let now = new Date();"
    },
    {
        c: "JavaScript regexp Type",
        d: "The regexp type represents regular expressions for pattern matching, created with RegExp or /pattern/ syntax. It’s used for string searching and validation.",
        e: "let regex = /[a-z]+/;"
    },

    // JavaScript: Operators
    {
        c: "JavaScript + Operator",
        d: "The + operator performs addition for numbers or concatenation for strings. It’s versatile but requires type awareness to avoid unexpected results.",
        e: "let sum = 5 + 3; // 8, or '5' + '3' = '53'"
    },
    {
        c: "JavaScript - Operator",
        d: "The - operator subtracts one number from another. It’s used for arithmetic operations and supports unary negation.",
        e: "let diff = 10 - 4; // 6"
    },
    {
        c: "JavaScript * Operator",
        d: "The * operator multiplies two numbers. It’s used for arithmetic calculations in expressions.",
        e: "let product = 5 * 3; // 15"
    },
    {
        c: "JavaScript / Operator",
        d: "The / operator divides one number by another. It returns a quotient, including floating-point results for non-integer division.",
        e: "let quotient = 10 / 2; // 5"
    },
    {
        c: "JavaScript % Operator",
        d: "The % operator returns the remainder of division. It’s used for modulo operations, like checking divisibility.",
        e: "let remainder = 10 % 3; // 1"
    },
    {
        c: "JavaScript ** Operator",
        d: "The ** operator raises a number to a power (exponentiation). It’s used for calculations like squares or cubes.",
        e: "let power = 2 ** 3; // 8"
    },
    {
        c: "JavaScript = Operator",
        d: "The = operator assigns a value to a variable. It’s the basic assignment operator, used for initializing or updating variables.",
        e: "let x = 10;"
    },
    {
        c: "JavaScript += Operator",
        d: "The += operator adds a value to a variable and assigns the result. It’s a shorthand for addition and assignment.",
        e: "let x = 5; x += 3; // x = 8"
    },
    {
        c: "JavaScript == Operator",
        d: "The == operator checks for equality after type coercion, comparing values loosely. It’s less strict than ===, so use cautiously.",
        e: "console.log(5 == '5'); // true"
    },
    {
        c: "JavaScript === Operator",
        d: "The === operator checks for strict equality, comparing both value and type. It’s preferred for reliable comparisons.",
        e: "console.log(5 === '5'); // false"
    },
    {
        c: "JavaScript != Operator",
        d: "The != operator checks for inequality after type coercion. It’s the loose counterpart to !==.",
        e: "console.log(5 != '5'); // false"
    },
    {
        c: "JavaScript !== Operator",
        d: "The !== operator checks for strict inequality, comparing both value and type. It’s preferred for precise checks.",
        e: "console.log(5 !== '5'); // true"
    },
    {
        c: "JavaScript &lt; Operator",
        d: "The &lt; operator checks if the left operand is less than the right. It’s used for numeric or string comparisons.",
        e: "console.log(3 &lt; 5); // true"
    },
    {
        c: "JavaScript &gt; Operator",
        d: "The &gt; operator checks if the left operand is greater than the right. It’s used for ordering comparisons.",
        e: "console.log(5 &gt; 3); // true"
    },
    {
        c: "JavaScript && Operator",
        d: "The && operator evaluates to true if both operands are truthy. It short-circuits, skipping the right operand if the left is false.",
        e: "if (x &gt; 0 && y &gt; 0) { console.log('Positive'); }"
    },
    {
        c: "JavaScript || Operator",
        d: "The || operator evaluates to true if either operand is truthy. It short-circuits, skipping the right operand if the left is true.",
        e: "let value = x || defaultValue;"
    },
    {
        c: "JavaScript ! Operator",
        d: "The ! operator negates a boolean value, converting truthy to false and falsy to true. It’s used for logical negation.",
        e: "console.log(!true); // false"
    },
    {
        c: "JavaScript & Operator",
        d: "The & operator performs a bitwise AND, comparing binary digits of two numbers. It’s used for low-level bit manipulation.",
        e: "let result = 5 & 3; // 1 (0101 & 0011 = 0001)"
    },
    {
        c: "JavaScript | Operator",
        d: "The | operator performs a bitwise OR, combining binary digits. It’s used for setting bits in flags or masks.",
        e: "let result = 5 | 3; // 7 (0101 | 0011 = 0111)"
    },
    {
        c: "JavaScript Ternary Operator",
        d: "The ternary operator (?:) evaluates a condition and returns one of two expressions. It’s a concise alternative to if-else for simple assignments.",
        e: "let status = age &gt;= 18 ? 'Adult' : 'Minor';"
    },

    // JavaScript: Built-in Objects & Methods
    // Global Objects
    {
        c: "JavaScript Object",
        d: "The Object constructor creates generic objects or serves as the base for all objects. It provides methods like keys() or assign() for manipulation.",
        e: "let obj = new Object({ key: 'value' });"
    },
    {
        c: "JavaScript Function",
        d: "The Function constructor creates dynamic functions from strings. It’s rarely used directly, as function declarations are preferred.",
        e: "let fn = new Function('x', 'return x * 2');"
    },
    {
        c: "JavaScript Boolean",
        d: "The Boolean constructor creates boolean objects, wrapping true or false. It’s used for type conversion or object-based logic.",
        e: "let bool = new Boolean(false);"
    },
    {
        c: "JavaScript Symbol",
        d: "The Symbol constructor creates unique identifiers, used as object keys to avoid collisions. It’s a primitive type introduced in ES6.",
        e: "let sym = Symbol('unique');"
    },
    {
        c: "JavaScript Error",
        d: "The Error constructor creates error objects with a message and stack trace. It’s used for custom error handling.",
        e: "throw new Error('Something went wrong');"
    },
    {
        c: "JavaScript EvalError",
        d: "The EvalError constructor creates errors related to the eval() function. It’s rarely used in modern JavaScript due to eval’s deprecation.",
        e: "throw new EvalError('Invalid eval usage');"
    },
    {
        c: "JavaScript RangeError",
        d: "The RangeError constructor creates errors when a value exceeds allowed ranges (e.g., array length). It’s used for boundary checks.",
        e: "throw new RangeError('Value out of range');"
    },
    {
        c: "JavaScript ReferenceError",
        d: "The ReferenceError constructor creates errors for invalid variable references. It occurs when accessing undefined variables.",
        e: "throw new ReferenceError('Variable not defined');"
    },
    {
        c: "JavaScript SyntaxError",
        d: "The SyntaxError constructor creates errors for invalid code syntax, like malformed JavaScript. It’s thrown during parsing.",
        e: "throw new SyntaxError('Invalid syntax');"
    },
    {
        c: "JavaScript TypeError",
        d: "The TypeError constructor creates errors when a value’s type is inappropriate for an operation (e.g., calling a non-function).",
        e: "throw new TypeError('Not a function');"
    },
    {
        c: "JavaScript URIError",
        d: "The URIError constructor creates errors for invalid URI functions, like decodeURI(). It’s used for URI-related operations.",
        e: "throw new URIError('Invalid URI');"
    },

    // Numbers & Math
    {
        c: "JavaScript Number",
        d: "The Number constructor creates number objects or converts values to numbers. It provides methods like toFixed() for formatting.",
        e: "let num = new Number(42);"
    },
    {
        c: "JavaScript BigInt",
        d: "The BigInt constructor creates arbitrary-precision integers, used for numbers beyond Number’s safe limit. It requires an 'n' suffix or constructor.",
        e: "let big = BigInt('12345678901234567890');"
    },
    {
        c: "JavaScript Math",
        d: "The Math object provides mathematical constants and functions, like Math.random() or Math.sqrt(). It’s static and non-constructable.",
        e: "let rand = Math.random();"
    },
    {
        c: "JavaScript toFixed() Method",
        d: "The toFixed() method formats a number to a fixed number of decimal places, returning a string. It’s used for currency or precision formatting.",
        e: "let num = 5.56789; console.log(num.toFixed(2)); // '5.57'"
    },
    {
        c: "JavaScript parseInt() Method",
        d: "The parseInt() function parses a string to an integer, optionally specifying a radix (base). It’s used for string-to-number conversion.",
        e: "let num = parseInt('42', 10); // 42"
    },
    {
        c: "JavaScript parseFloat() Method",
        d: "The parseFloat() function parses a string to a floating-point number. It’s used for decimal number extraction.",
        e: "let num = parseFloat('3.14'); // 3.14"
    },
    {
        c: "JavaScript Math.round() Method",
        d: "The Math.round() method rounds a number to the nearest integer. It’s used for simple rounding operations.",
        e: "let rounded = Math.round(4.7); // 5"
    },
    {
        c: "JavaScript Math.floor() Method",
        d: "The Math.floor() method rounds a number down to the nearest integer. It’s used for truncating decimals.",
        e: "let floored = Math.floor(4.9); // 4"
    },
    {
        c: "JavaScript Math.ceil() Method",
        d: "The Math.ceil() method rounds a number up to the nearest integer. It’s used for ceiling calculations.",
        e: "let ceiled = Math.ceil(4.1); // 5"
    },
    {
        c: "JavaScript Math.random() Method",
        d: "The Math.random() method generates a random floating-point number between 0 (inclusive) and 1 (exclusive). It’s used for randomization.",
        e: "let rand = Math.random(); // e.g., 0.723"
    },
    {
        c: "JavaScript Math.pow() Method",
        d: "The Math.pow() method raises a base to an exponent, equivalent to the ** operator. It’s used for power calculations.",
        e: "let power = Math.pow(2, 3); // 8"
    },
    {
        c: "JavaScript Math.sqrt() Method",
        d: "The Math.sqrt() method returns the square root of a number. It’s used for geometric or mathematical computations.",
        e: "let root = Math.sqrt(16); // 4"
    },
    {
        c: "JavaScript Math.abs() Method",
        d: "The Math.abs() method returns the absolute value of a number, removing its sign. It’s used for distance or magnitude calculations.",
        e: "let abs = Math.abs(-5); // 5"
    },

    // Strings
    {
        c: "JavaScript String",
        d: "The String constructor creates string objects or converts values to strings. It provides methods like slice() or includes() for manipulation.",
        e: "let str = new String('Hello');"
    },
    {
        c: "JavaScript charAt() Method",
        d: "The charAt() method returns the character at a specified index in a string. It’s used for accessing individual characters.",
        e: "let str = 'Hello'; console.log(str.charAt(1)); // 'e'"
    },
    {
        c: "JavaScript concat() Method",
        d: "The concat() method joins multiple strings into one. It’s less common than + or template literals but useful for programmatic concatenation.",
        e: "let str = 'Hello'.concat(' ', 'World'); // 'Hello World'"
    },
    {
        c: "JavaScript includes() Method",
        d: "The includes() method checks if a string contains a substring, returning true or false. It’s case-sensitive and used for searching.",
        e: "let str = 'Hello'; console.log(str.includes('ll')); // true"
    },
    {
        c: "JavaScript indexOf() Method",
        d: "The indexOf() method returns the first index of a substring, or -1 if not found. It’s used for position-based string operations.",
        e: "let str = 'Hello'; console.log(str.indexOf('l')); // 2"
    },
    {
        c: "JavaScript match() Method",
        d: "The match() method retrieves matches of a regular expression in a string, returning an array or null. It’s used for pattern matching.",
        e: "let str = 'abc123'; console.log(str.match(/[0-9]/g)); // ['1', '2', '3']"
    },
    {
        c: "JavaScript replace() Method",
        d: "The replace() method replaces the first match of a substring or regex with a new string. Use /g for global replacement.",
        e: "let str = 'Hello'; console.log(str.replace('l', 'p')); // 'Heppo'"
    },
    {
        c: "JavaScript slice() Method",
        d: "The slice() method extracts a portion of a string by start and end indices, returning a new string. It’s non-destructive.",
        e: "let str = 'Hello'; console.log(str.slice(1, 4)); // 'ell'"
    },
    {
        c: "JavaScript split() Method",
        d: "The split() method divides a string into an array based on a delimiter. It’s used for parsing or tokenizing strings.",
        e: "let str = 'a,b,c'; console.log(str.split(',')); // ['a', 'b', 'c']"
    },
    {
        c: "JavaScript toLowerCase() Method",
        d: "The toLowerCase() method converts a string to lowercase. It’s used for case-insensitive comparisons or formatting.",
        e: "let str = 'HELLO'; console.log(str.toLowerCase()); // 'hello'"
    },
    {
        c: "JavaScript toUpperCase() Method",
        d: "The toUpperCase() method converts a string to uppercase. It’s used for formatting or emphasis.",
        e: "let str = 'hello'; console.log(str.toUpperCase()); // 'HELLO'"
    },
    {
        c: "JavaScript trim() Method",
        d: "The trim() method removes whitespace from both ends of a string. It’s used for cleaning user input.",
        e: "let str = '  hello  '; console.log(str.trim()); // 'hello'"
    },

    // Arrays
    {
        c: "JavaScript Array",
        d: "The Array constructor creates arrays, ordered lists of values. It provides methods like map() or filter() for data manipulation.",
        e: "let arr = new Array(1, 2, 3);"
    },
    {
        c: "JavaScript push() Method",
        d: "The push() method adds one or more elements to the end of an array, returning the new length. It’s used for dynamic array growth.",
        e: "let arr = [1, 2]; arr.push(3); // [1, 2, 3]"
    },
    {
        c: "JavaScript pop() Method",
        d: "The pop() method removes and returns the last element of an array. It’s used for stack-like operations.",
        e: "let arr = [1, 2, 3]; arr.pop(); // 3, arr = [1, 2]"
    },
    {
        c: "JavaScript shift() Method",
        d: "The shift() method removes and returns the first element of an array, shifting others left. It’s used for queue-like operations.",
        e: "let arr = [1, 2, 3]; arr.shift(); // 1, arr = [2, 3]"
    },
    {
        c: "JavaScript unshift() Method",
        d: "The unshift() method adds elements to the start of an array, shifting others right. It returns the new length.",
        e: "let arr = [2, 3]; arr.unshift(1); // [1, 2, 3]"
    },
    {
        c: "JavaScript splice() Method",
        d: "The splice() method adds or removes elements at a specific index, modifying the array. It returns removed elements.",
        e: "let arr = [1, 2, 3]; arr.splice(1, 1, 'a'); // [2], arr = [1, 'a', 3]"
    },
    {
        c: "JavaScript slice() Method",
        d: "The slice() method extracts a portion of an array by start and end indices, returning a new array. It’s non-destructive.",
        e: "let arr = [1, 2, 3]; console.log(arr.slice(1, 3)); // [2, 3]"
    },
    {
        c: "JavaScript concat() Method",
        d: "The concat() method merges arrays or values into a new array, leaving originals unchanged. It’s used for combining data.",
        e: "let arr1 = [1, 2]; let arr2 = arr1.concat([3, 4]); // [1, 2, 3, 4]"
    },
    {
        c: "JavaScript join() Method",
        d: "The join() method combines array elements into a string, using a delimiter. It’s used for formatting or serialization.",
        e: "let arr = [1, 2, 3]; console.log(arr.join('-')); // '1-2-3'"
    },
    {
        c: "JavaScript map() Method",
        d: "The map() method creates a new array by applying a function to each element. It’s used for transforming data.",
        e: "let arr = [1, 2, 3]; let doubled = arr.map(x =&gt; x * 2); // [2, 4, 6]"
    },
    {
        c: "JavaScript filter() Method",
        d: "The filter() method creates a new array with elements passing a test function. It’s used for selecting subsets of data.",
        e: "let arr = [1, 2, 3]; let evens = arr.filter(x =&gt; x % 2 === 0); // [2]"
    },
    {
        c: "JavaScript reduce() Method",
        d: "The reduce() method applies a function to accumulate a single value from an array. It’s used for summing, concatenating, or transforming.",
        e: "let arr = [1, 2, 3]; let sum = arr.reduce((a, b) =&gt; a + b, 0); // 6"
    },
    {
        c: "JavaScript some() Method",
        d: "The some() method checks if at least one element passes a test, returning true or false. It’s used for existence checks.",
        e: "let arr = [1, 2, 3]; console.log(arr.some(x =&gt; x &gt; 2)); // true"
    },
    {
        c: "JavaScript every() Method",
        d: "The every() method checks if all elements pass a test, returning true or false. It’s used for validation.",
        e: "let arr = [1, 2, 3]; console.log(arr.every(x =&gt; x &gt; 0)); // true"
    },
    {
        c: "JavaScript find() Method",
        d: "The find() method returns the first element passing a test, or undefined. It’s used for searching specific values.",
        e: "let arr = [1, 2, 3]; console.log(arr.find(x =&gt; x &gt; 1)); // 2"
    },

    // Objects
    {
        c: "JavaScript Object.keys() Method",
        d: "The Object.keys() method returns an array of an object’s enumerable property names. It’s used for iterating or inspecting objects.",
        e: "let obj = { a: 1, b: 2 }; console.log(Object.keys(obj)); // ['a', 'b']"
    },
    {
        c: "JavaScript Object.values() Method",
        d: "The Object.values() method returns an array of an object’s enumerable property values. It’s used for accessing object data.",
        e: "let obj = { a: 1, b: 2 }; console.log(Object.values(obj)); // [1, 2]"
    },
    {
        c: "JavaScript Object.entries() Method",
        d: "The Object.entries() method returns an array of [key, value] pairs for an object’s enumerable properties. It’s used for iteration.",
        e: "let obj = { a: 1, b: 2 }; console.log(Object.entries(obj)); // [['a', 1], ['b', 2]]"
    },
    {
        c: "JavaScript Object.assign() Method",
        d: "The Object.assign() method copies properties from one or more source objects to a target object. It’s used for merging or cloning objects.",
        e: "let target = {}; Object.assign(target, { a: 1 }, { b: 2 }); // { a: 1, b: 2 }"
    },
    {
        c: "JavaScript Object.create() Method",
        d: "The Object.create() method creates a new object with a specified prototype. It’s used for inheritance or custom object creation.",
        e: "let proto = { greet() { return 'Hello'; } }; let obj = Object.create(proto);"
    },
    {
        c: "JavaScript Object.freeze() Method",
        d: "The Object.freeze() method prevents modifications to an object, making it immutable. It’s used for protecting data integrity.",
        e: "let obj = { a: 1 }; Object.freeze(obj); obj.a = 2; // No effect"
    },
    {
        c: "JavaScript Object.seal() Method",
        d: "The Object.seal() method prevents adding or removing properties but allows modifying existing ones. It’s used for partial immutability.",
        e: "let obj = { a: 1 }; Object.seal(obj); obj.b = 2; // No effect"
    },
    {
        c: "JavaScript Object.defineProperty() Method",
        d: "The Object.defineProperty() method defines or modifies a property on an object, specifying attributes like writable or enumerable. It’s used for fine-grained control.",
        e: "Object.defineProperty(obj, 'prop', { value: 42, writable: false });"
    },

    // Dates
    {
        c: "JavaScript Date",
        d: "The Date constructor creates objects representing dates and times. It provides methods for manipulation and formatting, like getFullYear().",
        e: "let date = new Date('2025-06-17');"
    },
    {
        c: "JavaScript getDate() Method",
        d: "The getDate() method returns the day of the month (1–31) for a Date object. It’s used for date extraction.",
        e: "let date = new Date(); console.log(date.getDate());"
    },
    {
        c: "JavaScript getFullYear() Method",
        d: "The getFullYear() method returns the four-digit year of a Date object. It’s used for precise year extraction.",
        e: "let date = new Date(); console.log(date.getFullYear()); // e.g., 2025"
    },
    {
        c: "JavaScript toISOString() Method",
        d: "The toISOString() method returns a Date object as an ISO 8601 string. It’s used for standardized date serialization.",
        e: "let date = new Date(); console.log(date.toISOString()); // e.g., '2025-06-17T00:00:00.000Z'"
    },
    {
        c: "JavaScript toLocaleDateString() Method",
        d: "The toLocaleDateString() method returns a localized string representation of a Date. It’s used for user-friendly formatting.",
        e: "let date = new Date(); console.log(date.toLocaleDateString('en-US')); // e.g., '6/17/2025'"
    },

    // Regular Expressions
    {
        c: "JavaScript RegExp",
        d: "The RegExp constructor creates regular expression objects for pattern matching. It’s used with methods like test() or string methods.",
        e: "let regex = new RegExp('^[a-z]+$');"
    },
    {
        c: "JavaScript test() Method",
        d: "The test() method checks if a string matches a regex pattern, returning true or false. It’s used for validation.",
        e: "let regex = /[a-z]/; console.log(regex.test('abc')); // true"
    },
    {
        c: "JavaScript exec() Method",
        d: "The exec() method executes a regex on a string, returning a match array or null. It’s used for detailed match extraction.",
        e: "let regex = /\\d+/; console.log(regex.exec('123abc')); // ['123', ...]"
    },

    // Browser & Web APIs: DOM Manipulation
    {
        c: "JavaScript document.getElementById()",
        d: "The document.getElementById() method returns an element by its ID. It’s a core DOM method for accessing specific elements.",
        e: "let elem = document.getElementById('myId');"
    },
    {
        c: "JavaScript querySelector()",
        d: "The querySelector() method returns the first element matching a CSS selector. It’s versatile for DOM traversal.",
        e: "let elem = document.querySelector('.class');"
    },
    {
        c: "JavaScript querySelectorAll()",
        d: "The querySelectorAll() method returns a NodeList of all elements matching a CSS selector. It’s used for bulk selection.",
        e: "let nodes = document.querySelectorAll('p');"
    },
    {
        c: "JavaScript createElement()",
        d: "The createElement() method creates a new DOM element by tag name. It’s used for dynamic content creation.",
        e: "let div = document.createElement('div');"
    },
    {
        c: "JavaScript appendChild()",
        d: "The appendChild() method adds a node as the last child of a parent element. It’s used for DOM manipulation.",
        e: "document.body.appendChild(div);"
    },
    {
        c: "JavaScript removeChild()",
        d: "The removeChild() method removes a child node from a parent. It’s used for dynamic DOM updates.",
        e: "parent.removeChild(child);"
    },
    {
        c: "JavaScript innerHTML Property",
        d: "The innerHTML property gets or sets an element’s HTML content as a string. It’s powerful but requires caution due to security risks.",
        e: "elem.innerHTML = '&lt;p&gt;New content&lt;/p&gt;';"
    },
    {
        c: "JavaScript textContent Property",
        d: "The textContent property gets or sets an element’s text content, ignoring HTML. It’s safer than innerHTML for text updates.",
        e: "elem.textContent = 'Plain text';"
    },
    {
        c: "JavaScript classList Property",
        d: "The classList property provides methods like add(), remove(), or toggle() to manage an element’s CSS classes. It’s used for dynamic styling.",
        e: "elem.classList.add('active');"
    },
    {
        c: "JavaScript style Property",
        d: "The style property accesses or sets an element’s inline CSS styles. It uses camelCase for property names (e.g., backgroundColor).",
        e: "elem.style.backgroundColor = 'blue';"
    },

    // Browser & Web APIs: Events
    {
        c: "JavaScript addEventListener()",
        d: "The addEventListener() method attaches an event handler to an element, supporting events like 'click' or 'keydown'. It’s preferred over inline handlers.",
        e: "elem.addEventListener('click', () =&gt; console.log('Clicked'));"
    },
    {
        c: "JavaScript removeEventListener()",
        d: "The removeEventListener() method detaches an event handler, requiring the same function reference. It’s used for cleanup.",
        e: "elem.removeEventListener('click', handler);"
    },
    {
        c: "JavaScript event.preventDefault()",
        d: "The event.preventDefault() method stops an event’s default behavior, like form submission or link navigation. It’s used for custom interactions.",
        e: "form.addEventListener('submit', (e) =&gt; e.preventDefault());"
    },
    {
        c: "JavaScript event.stopPropagation()",
        d: "The event.stopPropagation() method prevents an event from bubbling up or capturing down the DOM. It’s used to isolate events.",
        e: "elem.addEventListener('click', (e) =&gt; e.stopPropagation());"
    },

    // Browser & Web APIs: Storage
    {
        c: "JavaScript localStorage",
        d: "The localStorage object stores key-value pairs persistently across sessions. It’s used for client-side data storage with no expiration.",
        e: "localStorage.setItem('key', 'value');"
    },
    {
        c: "JavaScript sessionStorage",
        d: "The sessionStorage object stores key-value pairs for the duration of a browser session. It’s used for temporary data.",
        e: "sessionStorage.setItem('key', 'value');"
    },
    {
        c: "JavaScript setItem() Method",
        d: "The setItem() method stores a key-value pair in localStorage or sessionStorage. It’s used for data persistence.",
        e: "localStorage.setItem('theme', 'dark');"
    },
    {
        c: "JavaScript getItem() Method",
        d: "The getItem() method retrieves a value by key from localStorage or sessionStorage. It returns null if the key doesn’t exist.",
        e: "let theme = localStorage.getItem('theme');"
    },
    {
        c: "JavaScript removeItem() Method",
        d: "The removeItem() method deletes a key-value pair from localStorage or sessionStorage. It’s used for cleanup.",
        e: "localStorage.removeItem('key');"
    },
    {
        c: "JavaScript clear() Method",
        d: "The clear() method removes all key-value pairs from localStorage or sessionStorage. It’s used for resetting storage.",
        e: "localStorage.clear();"
    },

    // Browser & Web APIs: Timers
    {
        c: "JavaScript setTimeout()",
        d: "The setTimeout() function executes a callback after a specified delay in milliseconds. It returns an ID for cancellation.",
        e: "setTimeout(() =&gt; console.log('Delayed'), 1000);"
    },
    {
        c: "JavaScript setInterval()",
        d: "The setInterval() function repeatedly executes a callback at specified intervals. It’s used for recurring tasks.",
        e: "setInterval(() =&gt; console.log('Tick'), 1000);"
    },
    {
        c: "JavaScript clearTimeout()",
        d: "The clearTimeout() function cancels a setTimeout() call using its ID. It’s used to prevent delayed execution.",
        e: "let id = setTimeout(fn, 1000); clearTimeout(id);"
    },
    {
        c: "JavaScript clearInterval()",
        d: "The clearInterval() function cancels a setInterval() call using its ID. It’s used to stop recurring tasks.",
        e: "let id = setInterval(fn, 1000); clearInterval(id);"
    },

    // Browser & Web APIs: Networking
    {
        c: "JavaScript fetch()",
        d: "The fetch() function makes HTTP requests, returning a Promise. It’s used for AJAX calls and supports JSON, text, or other responses.",
        e: "fetch('https://api.example.com').then(res =&gt; res.json());"
    },
    {
        c: "JavaScript XMLHttpRequest",
        d: "The XMLHttpRequest object makes HTTP requests, older than fetch() but still used for complex scenarios. It supports synchronous and asynchronous calls.",
        e: "let xhr = new XMLHttpRequest(); xhr.open('GET', 'url'); xhr.send();"
    },
    {
        c: "JavaScript WebSocket",
        d: "The WebSocket object enables real-time, bidirectional communication with a server. It’s used for live updates or chat applications.",
        e: "let ws = new WebSocket('ws://example.com');"
    },

    // Browser & Web APIs: Other APIs
    {
        c: "JavaScript console.log()",
        d: "The console.log() method outputs messages to the browser’s console. It’s used for debugging and logging information.",
        e: "console.log('Debug message');"
    },
    {
        c: "JavaScript alert()",
        d: "The alert() function displays a simple dialog box with a message. It’s used for basic user notifications but blocks execution.",
        e: "alert('Warning!');"
    },
    {
        c: "JavaScript prompt()",
        d: "The prompt() function displays a dialog for user input, returning the entered value or null. It’s used for simple user interactions.",
        e: "let name = prompt('Enter your name');"
    },
    {
        c: "JavaScript confirm()",
        d: "The confirm() function displays a dialog with OK/Cancel options, returning true or false. It’s used for user confirmation.",
        e: "let result = confirm('Are you sure?');"
    },
    {
        c: "JavaScript navigator",
        d: "The navigator object provides browser and system information, like userAgent or geolocation. It’s used for feature detection or device info.",
        e: "console.log(navigator.userAgent);"
    },
    {
        c: "JavaScript location",
        d: "The location object manages the browser’s URL, allowing navigation or query string access. Properties like href or pathname are common.",
        e: "console.log(location.href);"
    },
    {
        c: "JavaScript history",
        d: "The history object manages browser session history, allowing navigation with methods like back() or pushState(). It’s used for SPA routing.",
        e: "history.pushState({}, '', '/new-page');"
    },
    {
        c: "JavaScript screen",
        d: "The screen object provides information about the user’s display, like width or height. It’s used for responsive design or analytics.",
        e: "console.log(screen.width);"
    },
    {
        c: "JavaScript performance",
        d: "The performance object provides timing-related data, like navigation or resource load times. It’s used for performance monitoring.",
        e: "console.log(performance.now());"
    },
    {
        c: "JavaScript Clipboard API",
        d: "The Clipboard API allows reading or writing to the system clipboard, using methods like writeText(). It requires user permission for security.",
        e: "navigator.clipboard.writeText('Copied!');"
    },
    {
        c: "JavaScript Notification API",
        d: "The Notification API displays system notifications, requiring user permission. It’s used for alerts or reminders in web apps, with options for title, body, or icon.",
        e: "new Notification('New message', { body: 'You have mail!' });"
    },
    {
        c: "JavaScript Geolocation API",
        d: "The Geolocation API retrieves the user’s geographic location, typically via GPS or IP, using methods like getCurrentPosition(). It requires user consent for privacy.",
        e: "navigator.geolocation.getCurrentPosition(pos =&gt; console.log(pos.coords.latitude));"
    },
    {
        c: "JavaScript Canvas API",
        d: "The Canvas API provides methods for drawing 2D graphics on a &lt;canvas&gt; element, using a context (e.g., '2d'). It’s used for animations, games, or visualizations.",
        e: "let ctx = canvas.getContext('2d'); ctx.fillRect(10, 10, 100, 100);"
    },
    {
        c: "JavaScript WebGL API",
        d: "The WebGL API renders 3D graphics in a &lt;canvas&gt; element, using OpenGL ES. It’s used for high-performance graphics, like games or simulations.",
        e: "let gl = canvas.getContext('webgl'); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);"
    },
    {
        c: "JavaScript IntersectionObserver API",
        d: "The IntersectionObserver API monitors an element’s visibility within an ancestor or viewport, triggering callbacks when it intersects. It’s used for lazy loading or animations.",
        e: "let observer = new IntersectionObserver(entries =&gt; entries.forEach(e =&gt; console.log(e.isIntersecting))); observer.observe(elem);"
    },
    {
        c: "JavaScript MutationObserver API",
        d: "The MutationObserver API watches for DOM changes, like added nodes or attribute modifications. It’s used for dynamic content updates or tracking.",
        e: "let observer = new MutationObserver(mutations =&gt; console.log(mutations)); observer.observe(document.body, { childList: true });"
    },
    {
        c: "JavaScript ResizeObserver API",
        d: "The ResizeObserver API monitors changes to an element’s size, triggering callbacks when dimensions change. It’s used for responsive layouts or dynamic resizing.",
        e: "let observer = new ResizeObserver(entries =&gt; console.log(entries[0].contentRect.width)); observer.observe(elem);"
    },
    {
        c: "JavaScript ServiceWorker API",
        d: "The ServiceWorker API enables offline capabilities and background tasks, intercepting network requests. It’s used for PWAs and caching.",
        e: "navigator.serviceWorker.register('sw.js').then(reg =&gt; console.log('ServiceWorker registered'));"
    },
    {
        c: "JavaScript Push API",
        d: "The Push API enables server-sent push notifications, working with ServiceWorker. It’s used for real-time updates, like messaging apps.",
        e: "navigator.serviceWorker.ready.then(reg =&gt; reg.pushManager.subscribe({ userVisibleOnly: true }));"
    },
    {
        c: "JavaScript WebRTC API",
        d: "The WebRTC API enables real-time peer-to-peer communication, like video or audio streams. It’s used for video calls or file sharing.",
        e: "let pc = new RTCPeerConnection(); pc.createOffer().then(offer =&gt; pc.setLocalDescription(offer));"
    },
    {
        c: "JavaScript getComputedStyle()",
        d: "The getComputedStyle() method retrieves the computed CSS styles for an element, including inherited or default values. It’s used for dynamic style inspection.",
        e: "let styles = window.getComputedStyle(elem); console.log(styles.color);"
    },
    {
        c: "JavaScript requestAnimationFrame()",
        d: "The requestAnimationFrame() method schedules a callback before the next repaint, optimizing animations. It’s used for smooth visual updates.",
        e: "requestAnimationFrame(() =&gt; elem.style.transform = 'translateX(10px)');"
    },
    {
        c: "JavaScript cancelAnimationFrame()",
        d: "The cancelAnimationFrame() method cancels a requestAnimationFrame callback, using its ID. It’s used to stop animations.",
        e: "let id = requestAnimationFrame(animate); cancelAnimationFrame(id);"
    },
    {
        c: "JavaScript window.open()",
        d: "The window.open() method opens a new browser window or tab, with optional URL and features. It’s used for popups or navigation.",
        e: "window.open('https://example.com', '_blank');"
    },
    {
        c: "JavaScript window.close()",
        d: "The window.close() method closes the current window or a window opened via window.open(). It’s used for popup management.",
        e: "window.close();"
    },
    {
        c: "JavaScript window.scrollTo()",
        d: "The window.scrollTo() method scrolls the window to specific coordinates or an element. It supports smooth scrolling with behavior options.",
        e: "window.scrollTo({ top: 100, behavior: 'smooth' });"
    },
    {
        c: "JavaScript window.matchMedia()",
        d: "The window.matchMedia() method tests if a media query matches, returning a MediaQueryList. It’s used for responsive design checks.",
        e: "let mq = window.matchMedia('(max-width: 600px)'); console.log(mq.matches);"
    },
    {
        c: "JavaScript trimStart() method",
        d: "The trimStart() method works similarly to the trim() method, except it only removes the whitespace from the beginning of a string.",
        e: "let str = '  hello  '; console.log(str.trimStart()); // 'hello  '"
    },
    {
        c: "JavaScript trimEnd() method",
        d: "The trimEnd() method works similarly to the trim() method, except it only removes the whitespace from the end of a string.",
        e: "let str = '  hello  '; console.log(str.trimEnd()); // '  hello'"
    },
    {
        c: "JavaScript isNaN function",
        d: "The isNaN() function is used to determine whether a value is NaN or not. It is best practice to use the Number constructor to provide a more reliable result.",
        e: "let value = 'apple'; console.log(Number.isNaN(Number(value))); // true"
    }
];
