import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };


type PickContentRelationshipFieldData<
	TRelationship extends prismic.CustomTypeModelFetchCustomTypeLevel1 | prismic.CustomTypeModelFetchCustomTypeLevel2 | prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2,
	TData extends Record<string, prismic.AnyRegularField | prismic.GroupField | prismic.NestedGroupField | prismic.SliceZone>,
	TLang extends string
> = |
	// Content relationship fields
	{
		[TSubRelationship in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchContentRelationshipLevel1
		> as TSubRelationship["id"]]:
			ContentRelationshipFieldWithData<TSubRelationship["customtypes"], TLang>;
	} &
	// Group
	{
		[TGroup in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2
		> as TGroup["id"]]:
			TData[TGroup["id"]] extends prismic.GroupField<infer TGroupData>
				? prismic.GroupField<PickContentRelationshipFieldData<TGroup, TGroupData, TLang>>
				: never
	} &
	// Other fields
	{
		[TFieldKey in Extract<TRelationship["fields"][number], string>]:
			TFieldKey extends keyof TData ? TData[TFieldKey] : never;
	};

type ContentRelationshipFieldWithData<
	TCustomType extends readonly (prismic.CustomTypeModelFetchCustomTypeLevel1 | string)[] | readonly (prismic.CustomTypeModelFetchCustomTypeLevel2 | string)[],
	TLang extends string = string
> = {
	[ID in Exclude<TCustomType[number], string>["id"]]:
		prismic.ContentRelationshipField<
			ID,
			TLang,
			PickContentRelationshipFieldData<
				Extract<TCustomType[number], { id: ID }>,
				Extract<prismic.Content.AllDocumentTypes, { type: ID }>["data"],
				TLang
			>
		>
}[Exclude<TCustomType[number], string>["id"]];

type BlogPostDocumentDataSlicesSlice = never

/**
 * Content for Blog Post documents
 */
interface BlogPostDocumentData {
	/**
	 * Title field in *Blog Post*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Post title...
	 * - **API ID Path**: blog_post.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Author field in *Blog Post*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Author Name
	 * - **API ID Path**: blog_post.author
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	author: prismic.KeyTextField;
	
	/**
	 * Featured Image field in *Blog Post*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: blog_post.featured_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	featured_image: prismic.ImageField<never>;
	
	/**
	 * Publish Date field in *Blog Post*
	 *
	 * - **Field Type**: Date
	 * - **Placeholder**: *None*
	 * - **API ID Path**: blog_post.date
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/date
	 */
	date: prismic.DateField;
	
	/**
	 * Excerpt field in *Blog Post*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Short description of the post...
	 * - **API ID Path**: blog_post.excerpt
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	excerpt: prismic.KeyTextField;
	
	/**
	 * Main Content field in *Blog Post*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: blog_post.content
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;/**
	 * Meta Title field in *Blog Post*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: SEO title
	 * - **API ID Path**: blog_post.meta_title
	 * - **Tab**: SEO
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Blog Post*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: SEO description
	 * - **API ID Path**: blog_post.meta_description
	 * - **Tab**: SEO
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Blog Post*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: blog_post.meta_image
	 * - **Tab**: SEO
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;/**
	 * Slice Zone field in *Blog Post*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: blog_post.slices[]
	 * - **Tab**: Body
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<BlogPostDocumentDataSlicesSlice>;
}

/**
 * Blog Post document from Prismic
 *
 * - **API ID**: `blog_post`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type BlogPostDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<BlogPostDocumentData>, "blog_post", Lang>;

/**
 * Item in *Navigation → Links*
 */
export interface NavigationDocumentDataLinksItem {
	/**
	 * Label field in *Navigation → Links*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Optional - Label for the link
	 * - **API ID Path**: navigation.links[].label
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	label: prismic.RichTextField;
	
	/**
	 * Link field in *Navigation → Links*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: Link for navigation item (leave empty if this item is a dropdown-only trigger)
	 * - **API ID Path**: navigation.links[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Item in *Navigation → Sub Links (Dropdown Items)*
 */
export interface NavigationDocumentDataSubLinksItem {
	/**
	 * Parent Label field in *Navigation → Sub Links (Dropdown Items)*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Must match exactly the parent link label text (e.g. 'Services')
	 * - **API ID Path**: navigation.sub_links[].parent_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	parent_label: prismic.KeyTextField;
	
	/**
	 * Label field in *Navigation → Sub Links (Dropdown Items)*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Sub item label
	 * - **API ID Path**: navigation.sub_links[].label
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	label: prismic.RichTextField;
	
	/**
	 * Link field in *Navigation → Sub Links (Dropdown Items)*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: Link for this sub-item
	 * - **API ID Path**: navigation.sub_links[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Item in *Navigation → Nested Links (3rd Level)*
 */
export interface NavigationDocumentDataNestedLinksItem {
	/**
	 * Parent Label field in *Navigation → Nested Links (3rd Level)*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Must match exactly the parent sub-link label text (e.g. 'Testovi')
	 * - **API ID Path**: navigation.nested_links[].parent_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	parent_label: prismic.KeyTextField;
	
	/**
	 * Label field in *Navigation → Nested Links (3rd Level)*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Nested item label
	 * - **API ID Path**: navigation.nested_links[].label
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	label: prismic.RichTextField;
	
	/**
	 * Link field in *Navigation → Nested Links (3rd Level)*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: navigation.nested_links[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Content for Navigation documents
 */
interface NavigationDocumentData {
	/**
	 * Links field in *Navigation*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: navigation.links[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	links: prismic.GroupField<Simplify<NavigationDocumentDataLinksItem>>;
	
	/**
	 * Sub Links (Dropdown Items) field in *Navigation*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: navigation.sub_links[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	sub_links: prismic.GroupField<Simplify<NavigationDocumentDataSubLinksItem>>;
	
	/**
	 * CTA Button Label field in *Navigation*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: e.g. Kontaktirajte nas
	 * - **API ID Path**: navigation.cta_label
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	cta_label: prismic.KeyTextField;
	
	/**
	 * CTA Button Link field in *Navigation*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: Link for the header CTA button
	 * - **API ID Path**: navigation.cta_link
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cta_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Nested Links (3rd Level) field in *Navigation*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: navigation.nested_links[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	nested_links: prismic.GroupField<Simplify<NavigationDocumentDataNestedLinksItem>>;
}

/**
 * Navigation document from Prismic
 *
 * - **API ID**: `navigation`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type NavigationDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<NavigationDocumentData>, "navigation", Lang>;

type PageDocumentDataSlicesSlice = RoiCalculatorSliceSlice | FeatureRowsSliceSlice | ContentSliceSlice | CardsGridSliceSlice | NewsletterSliceSlice | ChartSliceSlice | FeaturedBlogsSliceSlice | VideoSliceSlice | BlogListSliceSlice | TeamSliceSlice | TestimonialsSliceSlice | ClientsSliceSlice | FaqSliceSlice | CtaSliceSlice | ContactSliceSlice | OurStorySliceSlice | ServicesSliceSlice | HeroSliceSlice | WhyChooseSliceSlice | ProcessSliceSlice | CounterSliceSlice | SmallHeroSliceSlice | AlternatingCardsGridSliceSlice | ImageSliceSlice | HeadingSliceSlice | WebinarListSliceSlice | WebinarFormSliceSlice | TestsSliceSlice

/**
 * Content for Page documents
 */
interface PageDocumentData {
	/**
	 * Title field in *Page*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Title for the page
	 * - **API ID Path**: page.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Slice Zone field in *Page*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<PageDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Page document from Prismic
 *
 * - **API ID**: `page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type PageDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<PageDocumentData>, "page", Lang>;

/**
 * Content for Settings documents
 */
interface SettingsDocumentData {
	/**
	 * Site Title field in *Settings*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Title of the site
	 * - **API ID Path**: settings.siteTitle
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	siteTitle: prismic.RichTextField;
	
	/**
	 * Logo field in *Settings*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.logo
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	logo: prismic.ImageField<never>;/**
	 * Footer Heading field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Let's Talk With Us
	 * - **API ID Path**: settings.footerHeading
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	footerHeading: prismic.KeyTextField;
	
	/**
	 * Footer Logo field in *Settings*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.footerLogo
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	footerLogo: prismic.ImageField<never>;
	
	/**
	 * Footer Description field in *Settings*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Short tagline shown below the logo
	 * - **API ID Path**: settings.footerDescription
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	footerDescription: prismic.RichTextField;
	
	/**
	 * Contact Email field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: hello@example.com
	 * - **API ID Path**: settings.contactEmail
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	contactEmail: prismic.KeyTextField;
	
	/**
	 * Phone field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: +1 234 567 890
	 * - **API ID Path**: settings.phone
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	phone: prismic.KeyTextField;
	
	/**
	 * Address field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Street, City, Country
	 * - **API ID Path**: settings.address
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	address: prismic.KeyTextField;
	
	/**
	 * Facebook URL field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: https://www.facebook.com/yourpage
	 * - **API ID Path**: settings.facebookUrl
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	facebookUrl: prismic.KeyTextField;
	
	/**
	 * X (Twitter) URL field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: https://x.com/yourhandle
	 * - **API ID Path**: settings.twitterUrl
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	twitterUrl: prismic.KeyTextField;
	
	/**
	 * LinkedIn URL field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: https://www.linkedin.com/company/yourcompany
	 * - **API ID Path**: settings.linkedinUrl
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	linkedinUrl: prismic.KeyTextField;
	
	/**
	 * Instagram URL field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: https://www.instagram.com/yourhandle
	 * - **API ID Path**: settings.instagramUrl
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	instagramUrl: prismic.KeyTextField;
	
	/**
	 * Privacy Policy link field in *Settings*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.privacy_link
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	privacy_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Terms of Service link field in *Settings*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.terms_link
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	terms_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Cookie Consent page link field in *Settings*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.cookie_page_link
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cookie_page_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;/**
	 * Consent tab label field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Privola
	 * - **API ID Path**: settings.cookie_tab_consent
	 * - **Tab**: Cookies
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	cookie_tab_consent: prismic.KeyTextField;
	
	/**
	 * Details tab label field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Pojedinosti
	 * - **API ID Path**: settings.cookie_tab_details
	 * - **Tab**: Cookies
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	cookie_tab_details: prismic.KeyTextField;
	
	/**
	 * About tab label field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: O nama
	 * - **API ID Path**: settings.cookie_tab_about
	 * - **Tab**: Cookies
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	cookie_tab_about: prismic.KeyTextField;
	
	/**
	 * Consent body field in *Settings*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Short intro on the Consent tab
	 * - **API ID Path**: settings.cookie_consent_body
	 * - **Tab**: Cookies
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	cookie_consent_body: prismic.RichTextField;
	
	/**
	 * Details body field in *Settings*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Intro text above cookie categories
	 * - **API ID Path**: settings.cookie_details_body
	 * - **Tab**: Cookies
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	cookie_details_body: prismic.RichTextField;
	
	/**
	 * About body field in *Settings*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: What are cookies / about text
	 * - **API ID Path**: settings.cookie_about_body
	 * - **Tab**: Cookies
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	cookie_about_body: prismic.RichTextField;
	
	/**
	 * Customize button field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Prilagodi
	 * - **API ID Path**: settings.cookie_customize_label
	 * - **Tab**: Cookies
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	cookie_customize_label: prismic.KeyTextField;
	
	/**
	 * Allow all button field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Dopusti sve
	 * - **API ID Path**: settings.cookie_allow_label
	 * - **Tab**: Cookies
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	cookie_allow_label: prismic.KeyTextField;
	
	/**
	 * Necessary only button field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Samo nužno
	 * - **API ID Path**: settings.cookie_deny_label
	 * - **Tab**: Cookies
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	cookie_deny_label: prismic.KeyTextField;
	
	/**
	 * Save selection button field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Dopusti odabrano
	 * - **API ID Path**: settings.cookie_save_label
	 * - **Tab**: Cookies
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	cookie_save_label: prismic.KeyTextField;
	
	/**
	 * Consent title field in *Settings*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Ova web-stranica koristi kolačiće
	 * - **API ID Path**: settings.cookie_title
	 * - **Tab**: Cookies
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	cookie_title: prismic.RichTextField;
}

/**
 * Settings document from Prismic
 *
 * - **API ID**: `settings`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type SettingsDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<SettingsDocumentData>, "settings", Lang>;

export type AllDocumentTypes = BlogPostDocument | NavigationDocument | PageDocument | SettingsDocument;

/**
 * Item in *AlternatingCardsGridSlice → Default → Primary → Case Studies*
 */
export interface AlternatingCardsGridSliceSliceDefaultPrimaryCaseStudiesItem {
	/**
	 * Layout field in *AlternatingCardsGridSlice → Default → Primary → Case Studies*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: alternating_cards_grid_slice.default.primary.case_studies[].layout
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	layout: prismic.SelectField<"image-first" | "content-first">;
	
	/**
	 * Image field in *AlternatingCardsGridSlice → Default → Primary → Case Studies*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: alternating_cards_grid_slice.default.primary.case_studies[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Title field in *AlternatingCardsGridSlice → Default → Primary → Case Studies*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Scaling a growing team
	 * - **API ID Path**: alternating_cards_grid_slice.default.primary.case_studies[].title
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Details field in *AlternatingCardsGridSlice → Default → Primary → Case Studies*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Industry, company size, challenge and results
	 * - **API ID Path**: alternating_cards_grid_slice.default.primary.case_studies[].details
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	details: prismic.RichTextField;
	
	/**
	 * Link field in *AlternatingCardsGridSlice → Default → Primary → Case Studies*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: alternating_cards_grid_slice.default.primary.case_studies[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Item in *AlternatingCardsGridSlice → Blue → Primary → Case Studies*
 */
export interface AlternatingCardsGridSliceSliceBluePrimaryCaseStudiesItem {
	/**
	 * Layout field in *AlternatingCardsGridSlice → Blue → Primary → Case Studies*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: alternating_cards_grid_slice.blue.primary.case_studies[].layout
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	layout: prismic.SelectField<"image-first" | "content-first">;
	
	/**
	 * Image field in *AlternatingCardsGridSlice → Blue → Primary → Case Studies*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: alternating_cards_grid_slice.blue.primary.case_studies[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Title field in *AlternatingCardsGridSlice → Blue → Primary → Case Studies*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Scaling a growing team
	 * - **API ID Path**: alternating_cards_grid_slice.blue.primary.case_studies[].title
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Details field in *AlternatingCardsGridSlice → Blue → Primary → Case Studies*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Industry, company size, challenge and results
	 * - **API ID Path**: alternating_cards_grid_slice.blue.primary.case_studies[].details
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	details: prismic.RichTextField;
	
	/**
	 * Link field in *AlternatingCardsGridSlice → Blue → Primary → Case Studies*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: alternating_cards_grid_slice.blue.primary.case_studies[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Item in *AlternatingCardsGridSlice → White Background → Primary → Case Studies*
 */
export interface AlternatingCardsGridSliceSliceWhiteBackgroundPrimaryCaseStudiesItem {
	/**
	 * Layout field in *AlternatingCardsGridSlice → White Background → Primary → Case Studies*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: alternating_cards_grid_slice.whiteBackground.primary.case_studies[].layout
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	layout: prismic.SelectField<"image-first" | "content-first">;
	
	/**
	 * Image field in *AlternatingCardsGridSlice → White Background → Primary → Case Studies*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: alternating_cards_grid_slice.whiteBackground.primary.case_studies[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Title field in *AlternatingCardsGridSlice → White Background → Primary → Case Studies*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Scaling a growing team
	 * - **API ID Path**: alternating_cards_grid_slice.whiteBackground.primary.case_studies[].title
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Details field in *AlternatingCardsGridSlice → White Background → Primary → Case Studies*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Industry, company size, challenge and results
	 * - **API ID Path**: alternating_cards_grid_slice.whiteBackground.primary.case_studies[].details
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	details: prismic.RichTextField;
	
	/**
	 * Link field in *AlternatingCardsGridSlice → White Background → Primary → Case Studies*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: alternating_cards_grid_slice.whiteBackground.primary.case_studies[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Primary content in *AlternatingCardsGridSlice → Default → Primary*
 */
export interface AlternatingCardsGridSliceSliceDefaultPrimary {
	/**
	 * Sub Label field in *AlternatingCardsGridSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Case Studies
	 * - **API ID Path**: alternating_cards_grid_slice.default.primary.sub_label
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	sub_label: prismic.RichTextField;
	
	/**
	 * Heading field in *AlternatingCardsGridSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: See how stronger HR systems improve efficiency and growth.
	 * - **API ID Path**: alternating_cards_grid_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * CTA Label field in *AlternatingCardsGridSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: View Case Studies
	 * - **API ID Path**: alternating_cards_grid_slice.default.primary.cta_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	cta_label: prismic.KeyTextField;
	
	/**
	 * CTA Link field in *AlternatingCardsGridSlice → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: alternating_cards_grid_slice.default.primary.cta_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cta_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Case Studies field in *AlternatingCardsGridSlice → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: alternating_cards_grid_slice.default.primary.case_studies[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	case_studies: prismic.GroupField<Simplify<AlternatingCardsGridSliceSliceDefaultPrimaryCaseStudiesItem>>;
}

/**
 * Default variation for AlternatingCardsGridSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Alternating cards grid section
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type AlternatingCardsGridSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<AlternatingCardsGridSliceSliceDefaultPrimary>, never>;

/**
 * Primary content in *AlternatingCardsGridSlice → Blue → Primary*
 */
export interface AlternatingCardsGridSliceSliceBluePrimary {
	/**
	 * Sub Label field in *AlternatingCardsGridSlice → Blue → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Case Studies
	 * - **API ID Path**: alternating_cards_grid_slice.blue.primary.sub_label
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	sub_label: prismic.RichTextField;
	
	/**
	 * Heading field in *AlternatingCardsGridSlice → Blue → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: See how stronger HR systems improve efficiency and growth.
	 * - **API ID Path**: alternating_cards_grid_slice.blue.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * CTA Label field in *AlternatingCardsGridSlice → Blue → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: View Case Studies
	 * - **API ID Path**: alternating_cards_grid_slice.blue.primary.cta_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	cta_label: prismic.KeyTextField;
	
	/**
	 * CTA Link field in *AlternatingCardsGridSlice → Blue → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: alternating_cards_grid_slice.blue.primary.cta_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cta_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Case Studies field in *AlternatingCardsGridSlice → Blue → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: alternating_cards_grid_slice.blue.primary.case_studies[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	case_studies: prismic.GroupField<Simplify<AlternatingCardsGridSliceSliceBluePrimaryCaseStudiesItem>>;
}

/**
 * Blue variation for AlternatingCardsGridSlice Slice
 *
 * - **API ID**: `blue`
 * - **Description**: Blue accent variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type AlternatingCardsGridSliceSliceBlue = prismic.SharedSliceVariation<"blue", Simplify<AlternatingCardsGridSliceSliceBluePrimary>, never>;

/**
 * Primary content in *AlternatingCardsGridSlice → White Background → Primary*
 */
export interface AlternatingCardsGridSliceSliceWhiteBackgroundPrimary {
	/**
	 * Sub Label field in *AlternatingCardsGridSlice → White Background → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Case Studies
	 * - **API ID Path**: alternating_cards_grid_slice.whiteBackground.primary.sub_label
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	sub_label: prismic.RichTextField;
	
	/**
	 * Heading field in *AlternatingCardsGridSlice → White Background → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: See how stronger HR systems improve efficiency and growth.
	 * - **API ID Path**: alternating_cards_grid_slice.whiteBackground.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * CTA Label field in *AlternatingCardsGridSlice → White Background → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: View Case Studies
	 * - **API ID Path**: alternating_cards_grid_slice.whiteBackground.primary.cta_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	cta_label: prismic.KeyTextField;
	
	/**
	 * CTA Link field in *AlternatingCardsGridSlice → White Background → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: alternating_cards_grid_slice.whiteBackground.primary.cta_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cta_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Case Studies field in *AlternatingCardsGridSlice → White Background → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: alternating_cards_grid_slice.whiteBackground.primary.case_studies[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	case_studies: prismic.GroupField<Simplify<AlternatingCardsGridSliceSliceWhiteBackgroundPrimaryCaseStudiesItem>>;
}

/**
 * White Background variation for AlternatingCardsGridSlice Slice
 *
 * - **API ID**: `whiteBackground`
 * - **Description**: White background variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type AlternatingCardsGridSliceSliceWhiteBackground = prismic.SharedSliceVariation<"whiteBackground", Simplify<AlternatingCardsGridSliceSliceWhiteBackgroundPrimary>, never>;

/**
 * Slice variation for *AlternatingCardsGridSlice*
 */
type AlternatingCardsGridSliceSliceVariation = AlternatingCardsGridSliceSliceDefault | AlternatingCardsGridSliceSliceBlue | AlternatingCardsGridSliceSliceWhiteBackground

/**
 * AlternatingCardsGridSlice Shared Slice
 *
 * - **API ID**: `alternating_cards_grid_slice`
 * - **Description**: Alternating case study cards grid
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type AlternatingCardsGridSliceSlice = prismic.SharedSlice<"alternating_cards_grid_slice", AlternatingCardsGridSliceSliceVariation>;

/**
 * Primary content in *BlogBodySlice → Default → Primary*
 */
export interface BlogBodySliceSliceDefaultPrimary {
	/**
	 * Content field in *BlogBodySlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: blog_body_slice.default.primary.content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
}

/**
 * Default variation for BlogBodySlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BlogBodySliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<BlogBodySliceSliceDefaultPrimary>, never>;

/**
 * Primary content in *BlogBodySlice → Quote → Primary*
 */
export interface BlogBodySliceSliceQuotePrimary {
	/**
	 * Quote Text field in *BlogBodySlice → Quote → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: "Inspiring quote goes here..."
	 * - **API ID Path**: blog_body_slice.quote.primary.quote_text
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	quote_text: prismic.RichTextField;
	
	/**
	 * Quote Source field in *BlogBodySlice → Quote → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: - Author, Source
	 * - **API ID Path**: blog_body_slice.quote.primary.quote_source
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	quote_source: prismic.KeyTextField;
}

/**
 * Quote variation for BlogBodySlice Slice
 *
 * - **API ID**: `quote`
 * - **Description**: A highlighted quote block
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BlogBodySliceSliceQuote = prismic.SharedSliceVariation<"quote", Simplify<BlogBodySliceSliceQuotePrimary>, never>;

/**
 * Slice variation for *BlogBodySlice*
 */
type BlogBodySliceSliceVariation = BlogBodySliceSliceDefault | BlogBodySliceSliceQuote

/**
 * BlogBodySlice Shared Slice
 *
 * - **API ID**: `blog_body_slice`
 * - **Description**: Rich text body content for blog posts
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BlogBodySliceSlice = prismic.SharedSlice<"blog_body_slice", BlogBodySliceSliceVariation>;

/**
 * Primary content in *BlogListSlice → Default → Primary*
 */
export interface BlogListSliceSliceDefaultPrimary {
	/**
	 * Heading field in *BlogListSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Our Blog
	 * - **API ID Path**: blog_list_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Description field in *BlogListSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Insights, tips and industry news
	 * - **API ID Path**: blog_list_slice.default.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	description: prismic.KeyTextField;
}

/**
 * Default variation for BlogListSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BlogListSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<BlogListSliceSliceDefaultPrimary>, never>;

/**
 * Slice variation for *BlogListSlice*
 */
type BlogListSliceSliceVariation = BlogListSliceSliceDefault

/**
 * BlogListSlice Shared Slice
 *
 * - **API ID**: `blog_list_slice`
 * - **Description**: Blog post grid with search filtering and client-side pagination
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BlogListSliceSlice = prismic.SharedSlice<"blog_list_slice", BlogListSliceSliceVariation>;

/**
 * Item in *CardsGridSlice → Default → Primary → Services*
 */
export interface CardsGridSliceSliceDefaultPrimaryCardsItem {
	/**
	 * Image field in *CardsGridSlice → Default → Primary → Services*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cards_grid_slice.default.primary.cards[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Title field in *CardsGridSlice → Default → Primary → Services*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Talent Acquisition
	 * - **API ID Path**: cards_grid_slice.default.primary.cards[].title
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Description field in *CardsGridSlice → Default → Primary → Services*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Attract and hire the right talent...
	 * - **API ID Path**: cards_grid_slice.default.primary.cards[].description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Bullet List field in *CardsGridSlice → Default → Primary → Services*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cards_grid_slice.default.primary.cards[].bullet_list
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	bullet_list: prismic.RichTextField;
	
	/**
	 * Button Label field in *CardsGridSlice → Default → Primary → Services*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Learn More
	 * - **API ID Path**: cards_grid_slice.default.primary.cards[].button_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_label: prismic.KeyTextField;
	
	/**
	 * Button Link field in *CardsGridSlice → Default → Primary → Services*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cards_grid_slice.default.primary.cards[].button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Item in *CardsGridSlice → Blue → Primary → Services*
 */
export interface CardsGridSliceSliceBluePrimaryCardsItem {
	/**
	 * Image field in *CardsGridSlice → Blue → Primary → Services*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cards_grid_slice.blue.primary.cards[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Title field in *CardsGridSlice → Blue → Primary → Services*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Talent Acquisition
	 * - **API ID Path**: cards_grid_slice.blue.primary.cards[].title
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Description field in *CardsGridSlice → Blue → Primary → Services*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Attract and hire the right talent...
	 * - **API ID Path**: cards_grid_slice.blue.primary.cards[].description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Bullet List field in *CardsGridSlice → Blue → Primary → Services*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cards_grid_slice.blue.primary.cards[].bullet_list
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	bullet_list: prismic.RichTextField;
	
	/**
	 * Button Label field in *CardsGridSlice → Blue → Primary → Services*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Learn More
	 * - **API ID Path**: cards_grid_slice.blue.primary.cards[].button_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_label: prismic.KeyTextField;
	
	/**
	 * Button Link field in *CardsGridSlice → Blue → Primary → Services*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cards_grid_slice.blue.primary.cards[].button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Primary content in *CardsGridSlice → Default → Primary*
 */
export interface CardsGridSliceSliceDefaultPrimary {
	/**
	 * Sub Label field in *CardsGridSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Our Services
	 * - **API ID Path**: cards_grid_slice.default.primary.sub_label
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	sub_label: prismic.RichTextField;
	
	/**
	 * Heading field in *CardsGridSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: We Offer End-to-end HR Consulting Services
	 * - **API ID Path**: cards_grid_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Bottom Bar Text field in *CardsGridSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Explore Expert HR Recruitment Solutions.
	 * - **API ID Path**: cards_grid_slice.default.primary.bottom_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	bottom_text: prismic.KeyTextField;
	
	/**
	 * Bottom Bar Link Label field in *CardsGridSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: View All Services.
	 * - **API ID Path**: cards_grid_slice.default.primary.bottom_link_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	bottom_link_label: prismic.KeyTextField;
	
	/**
	 * Bottom Bar Link field in *CardsGridSlice → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cards_grid_slice.default.primary.bottom_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	bottom_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Services field in *CardsGridSlice → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cards_grid_slice.default.primary.cards[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	cards: prismic.GroupField<Simplify<CardsGridSliceSliceDefaultPrimaryCardsItem>>;
}

/**
 * Default variation for CardsGridSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Services grid section
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CardsGridSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<CardsGridSliceSliceDefaultPrimary>, never>;

/**
 * Primary content in *CardsGridSlice → Blue → Primary*
 */
export interface CardsGridSliceSliceBluePrimary {
	/**
	 * Sub Label field in *CardsGridSlice → Blue → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Our Services
	 * - **API ID Path**: cards_grid_slice.blue.primary.sub_label
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	sub_label: prismic.RichTextField;
	
	/**
	 * Heading field in *CardsGridSlice → Blue → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: We Offer End-to-end HR Consulting Services
	 * - **API ID Path**: cards_grid_slice.blue.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Bottom Bar Text field in *CardsGridSlice → Blue → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Explore Expert HR Recruitment Solutions.
	 * - **API ID Path**: cards_grid_slice.blue.primary.bottom_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	bottom_text: prismic.KeyTextField;
	
	/**
	 * Bottom Bar Link Label field in *CardsGridSlice → Blue → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: View All Services.
	 * - **API ID Path**: cards_grid_slice.blue.primary.bottom_link_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	bottom_link_label: prismic.KeyTextField;
	
	/**
	 * Bottom Bar Link field in *CardsGridSlice → Blue → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cards_grid_slice.blue.primary.bottom_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	bottom_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Services field in *CardsGridSlice → Blue → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cards_grid_slice.blue.primary.cards[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	cards: prismic.GroupField<Simplify<CardsGridSliceSliceBluePrimaryCardsItem>>;
}

/**
 * Blue variation for CardsGridSlice Slice
 *
 * - **API ID**: `blue`
 * - **Description**: Blue accent variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CardsGridSliceSliceBlue = prismic.SharedSliceVariation<"blue", Simplify<CardsGridSliceSliceBluePrimary>, never>;

/**
 * Slice variation for *CardsGridSlice*
 */
type CardsGridSliceSliceVariation = CardsGridSliceSliceDefault | CardsGridSliceSliceBlue

/**
 * CardsGridSlice Shared Slice
 *
 * - **API ID**: `cards_grid_slice`
 * - **Description**: Consulting services grid — alternating image tiles and content cards
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CardsGridSliceSlice = prismic.SharedSlice<"cards_grid_slice", CardsGridSliceSliceVariation>;

/**
 * Primary content in *ChartSlice → Default → Primary*
 */
export interface ChartSliceSliceDefaultPrimary {
	/**
	 * Heading field in *ChartSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Section heading
	 * - **API ID Path**: chart_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Description field in *ChartSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Description shown below the chart
	 * - **API ID Path**: chart_slice.default.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Chart Type field in *ChartSlice → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: Select chart type
	 * - **Default Value**: bar
	 * - **API ID Path**: chart_slice.default.primary.chart_type
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	chart_type: prismic.SelectField<"bar" | "line" | "pie", "filled">;
	
	/**
	 * Chart Color field in *ChartSlice → Default → Primary*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: Primary color for the chart
	 * - **API ID Path**: chart_slice.default.primary.chart_color
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	chart_color: prismic.ColorField;
}

/**
 * Primary content in *ChartSlice → Items*
 */
export interface ChartSliceSliceDefaultItem {
	/**
	 * Label field in *ChartSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: e.g. January
	 * - **API ID Path**: chart_slice.items[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Value field in *ChartSlice → Items*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: e.g. 42
	 * - **API ID Path**: chart_slice.items[].value
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	value: prismic.NumberField;
}

/**
 * Default variation for ChartSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: ChartSlice
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ChartSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ChartSliceSliceDefaultPrimary>, Simplify<ChartSliceSliceDefaultItem>>;

/**
 * Slice variation for *ChartSlice*
 */
type ChartSliceSliceVariation = ChartSliceSliceDefault

/**
 * ChartSlice Shared Slice
 *
 * - **API ID**: `chart_slice`
 * - **Description**: Chart section with heading, chart and description
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ChartSliceSlice = prismic.SharedSlice<"chart_slice", ChartSliceSliceVariation>;

/**
 * Primary content in *ClientsSlice → Default → Primary*
 */
export interface ClientsSliceSliceDefaultPrimary {
	/**
	 * Heading field in *ClientsSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Our Valuable Clients
	 * - **API ID Path**: clients_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
}

/**
 * Primary content in *ClientsSlice → Items*
 */
export interface ClientsSliceSliceDefaultItem {
	/**
	 * Client Logo field in *ClientsSlice → Items*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: clients_slice.items[].logo
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	logo: prismic.ImageField<never>;
	
	/**
	 * Client Name field in *ClientsSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Company Name
	 * - **API ID Path**: clients_slice.items[].logo_name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	logo_name: prismic.KeyTextField;
}

/**
 * Default variation for ClientsSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ClientsSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ClientsSliceSliceDefaultPrimary>, Simplify<ClientsSliceSliceDefaultItem>>;

/**
 * Slice variation for *ClientsSlice*
 */
type ClientsSliceSliceVariation = ClientsSliceSliceDefault

/**
 * ClientsSlice Shared Slice
 *
 * - **API ID**: `clients_slice`
 * - **Description**: Auto-scrolling client logos marquee
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ClientsSliceSlice = prismic.SharedSlice<"clients_slice", ClientsSliceSliceVariation>;

/**
 * Item in *ContactSlice → Default → Primary → Role Dropdown Options*
 */
export interface ContactSliceSliceDefaultPrimaryRoleOptionsItem {
	/**
	 * Role Label field in *ContactSlice → Default → Primary → Role Dropdown Options*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Vlasnik / Direktor
	 * - **API ID Path**: contact_slice.default.primary.role_options[].role_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	role_label: prismic.KeyTextField;
	
	/**
	 * Role Value field in *ContactSlice → Default → Primary → Role Dropdown Options*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: vlasnik-direktor
	 * - **API ID Path**: contact_slice.default.primary.role_options[].role_value
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	role_value: prismic.KeyTextField;
}

/**
 * Primary content in *ContactSlice → Default → Primary*
 */
export interface ContactSliceSliceDefaultPrimary {
	/**
	 * Info Heading field in *ContactSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Get In Touch
	 * - **API ID Path**: contact_slice.default.primary.info_heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	info_heading: prismic.KeyTextField;
	
	/**
	 * Form Heading field in *ContactSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Send Us A Message
	 * - **API ID Path**: contact_slice.default.primary.form_heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	form_heading: prismic.KeyTextField;
	
	/**
	 * Form Description field in *ContactSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Fill out the form below and our team will get back to you within 24 hours.
	 * - **API ID Path**: contact_slice.default.primary.form_description
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	form_description: prismic.KeyTextField;
	
	/**
	 * Submit Button Label field in *ContactSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Send Message
	 * - **API ID Path**: contact_slice.default.primary.submit_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	submit_label: prismic.KeyTextField;
	
	/**
	 * Role Field Label field in *ContactSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Vaša pozicija u tvrtki:
	 * - **API ID Path**: contact_slice.default.primary.role_field_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	role_field_label: prismic.KeyTextField;
	
	/**
	 * Role Dropdown Options field in *ContactSlice → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact_slice.default.primary.role_options[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	role_options: prismic.GroupField<Simplify<ContactSliceSliceDefaultPrimaryRoleOptionsItem>>;
	
	/**
	 * Show Map field in *ContactSlice → Default → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: true
	 * - **API ID Path**: contact_slice.default.primary.show_map
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	show_map: prismic.BooleanField;
	
	/**
	 * Google Maps Embed URL field in *ContactSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: https://www.google.com/maps/embed?...
	 * - **API ID Path**: contact_slice.default.primary.map_embed_url
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	map_embed_url: prismic.KeyTextField;
}

/**
 * Primary content in *ContactSlice → Items*
 */
export interface ContactSliceSliceDefaultItem {
	/**
	 * Office Name field in *ContactSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: New York Headquarters
	 * - **API ID Path**: contact_slice.items[].office_name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	office_name: prismic.KeyTextField;
	
	/**
	 * Office Address field in *ContactSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: 753 Business Ave, Suite 500, New York, NY 10001
	 * - **API ID Path**: contact_slice.items[].office_address
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	office_address: prismic.KeyTextField;
	
	/**
	 * Office Hours field in *ContactSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Mon-Fri: 9:00 AM - 6:00 PM
	 * - **API ID Path**: contact_slice.items[].office_hours
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	office_hours: prismic.KeyTextField;
}

/**
 * Default variation for ContactSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ContactSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ContactSliceSliceDefaultPrimary>, Simplify<ContactSliceSliceDefaultItem>>;

/**
 * Slice variation for *ContactSlice*
 */
type ContactSliceSliceVariation = ContactSliceSliceDefault

/**
 * ContactSlice Shared Slice
 *
 * - **API ID**: `contact_slice`
 * - **Description**: Contact section with info panel, offices list, and contact form
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ContactSliceSlice = prismic.SharedSlice<"contact_slice", ContactSliceSliceVariation>;

/**
 * Primary content in *ContentSlice → Default → Primary*
 */
export interface ContentSliceSliceDefaultPrimary {
	/**
	 * Heading field in *ContentSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: End-to-end Permanent Placement
	 * - **API ID Path**: content_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Lead field in *ContentSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: We handle the entire recruitment lifecycle, from initial sourcing to successful onboarding and beyond.
	 * - **API ID Path**: content_slice.default.primary.lead
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	lead: prismic.RichTextField;
	
	/**
	 * Body field in *ContentSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Add full-width service details
	 * - **API ID Path**: content_slice.default.primary.body
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	body: prismic.RichTextField;
}

/**
 * Default variation for ContentSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Full-width content section
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ContentSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ContentSliceSliceDefaultPrimary>, never>;

/**
 * Slice variation for *ContentSlice*
 */
type ContentSliceSliceVariation = ContentSliceSliceDefault

/**
 * ContentSlice Shared Slice
 *
 * - **API ID**: `content_slice`
 * - **Description**: Full-width rich content section
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ContentSliceSlice = prismic.SharedSlice<"content_slice", ContentSliceSliceVariation>;

/**
 * Primary content in *CounterSlice → Items*
 */
export interface CounterSliceSliceDefaultItem {
	/**
	 * Value field in *CounterSlice → Items*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: 50
	 * - **API ID Path**: counter_slice.items[].value
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	value: prismic.NumberField;
	
	/**
	 * Suffix field in *CounterSlice → Items*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: counter_slice.items[].suffix
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	suffix: prismic.SelectField<"+" | "%" | "x" | "K+" | "M+" | "Days">;
	
	/**
	 * Label field in *CounterSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Average Implementation Time
	 * - **API ID Path**: counter_slice.items[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
}

/**
 * Default variation for CounterSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CounterSliceSliceDefault = prismic.SharedSliceVariation<"default", Record<string, never>, Simplify<CounterSliceSliceDefaultItem>>;

/**
 * Primary content in *CounterSlice → Items*
 */
export interface CounterSliceSliceAltBackgroundItem {
	/**
	 * Value field in *CounterSlice → Items*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: 50
	 * - **API ID Path**: counter_slice.items[].value
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	value: prismic.NumberField;
	
	/**
	 * Suffix field in *CounterSlice → Items*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: counter_slice.items[].suffix
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	suffix: prismic.SelectField<"+" | "%" | "x" | "K+" | "M+" | "Days">;
	
	/**
	 * Label field in *CounterSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Average Implementation Time
	 * - **API ID Path**: counter_slice.items[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
}

/**
 * Alt Background variation for CounterSlice Slice
 *
 * - **API ID**: `altBackground`
 * - **Description**: Same counters with secondary background
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CounterSliceSliceAltBackground = prismic.SharedSliceVariation<"altBackground", Record<string, never>, Simplify<CounterSliceSliceAltBackgroundItem>>;

/**
 * Primary content in *CounterSlice → Items*
 */
export interface CounterSliceSliceBlueItem {
	/**
	 * Value field in *CounterSlice → Items*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: 50
	 * - **API ID Path**: counter_slice.items[].value
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	value: prismic.NumberField;
	
	/**
	 * Suffix field in *CounterSlice → Items*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: counter_slice.items[].suffix
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	suffix: prismic.SelectField<"+" | "%" | "x" | "K+" | "M+" | "Days">;
	
	/**
	 * Label field in *CounterSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Average Implementation Time
	 * - **API ID Path**: counter_slice.items[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
}

/**
 * Blue variation for CounterSlice Slice
 *
 * - **API ID**: `blue`
 * - **Description**: Blue accent variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CounterSliceSliceBlue = prismic.SharedSliceVariation<"blue", Record<string, never>, Simplify<CounterSliceSliceBlueItem>>;

/**
 * Slice variation for *CounterSlice*
 */
type CounterSliceSliceVariation = CounterSliceSliceDefault | CounterSliceSliceAltBackground | CounterSliceSliceBlue

/**
 * CounterSlice Shared Slice
 *
 * - **API ID**: `counter_slice`
 * - **Description**: Animated KPI counters from services-2 template
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CounterSliceSlice = prismic.SharedSlice<"counter_slice", CounterSliceSliceVariation>;

/**
 * Primary content in *CtaSlice → Default → Primary*
 */
export interface CtaSliceSliceDefaultPrimary {
	/**
	 * Heading field in *CtaSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Ready To Transform Your Workplace?
	 * - **API ID Path**: cta_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Description field in *CtaSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Join 200+ companies that have improved their HR functions with expert consulting.
	 * - **API ID Path**: cta_slice.default.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	description: prismic.KeyTextField;
	
	/**
	 * Button Label field in *CtaSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Start Now
	 * - **API ID Path**: cta_slice.default.primary.button_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_label: prismic.KeyTextField;
	
	/**
	 * Button Link field in *CtaSlice → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cta_slice.default.primary.button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Default variation for CtaSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CtaSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<CtaSliceSliceDefaultPrimary>, never>;

/**
 * Primary content in *CtaSlice → Green Background → Primary*
 */
export interface CtaSliceSliceGreenBgPrimary {
	/**
	 * Heading field in *CtaSlice → Green Background → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Ready To Transform Your Workplace?
	 * - **API ID Path**: cta_slice.greenBg.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Description field in *CtaSlice → Green Background → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Join 200+ companies that have improved their HR functions.
	 * - **API ID Path**: cta_slice.greenBg.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	description: prismic.KeyTextField;
	
	/**
	 * Button Label field in *CtaSlice → Green Background → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Start Now
	 * - **API ID Path**: cta_slice.greenBg.primary.button_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_label: prismic.KeyTextField;
	
	/**
	 * Button Link field in *CtaSlice → Green Background → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cta_slice.greenBg.primary.button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Green Background variation for CtaSlice Slice
 *
 * - **API ID**: `greenBg`
 * - **Description**: CTA banner with green background (color-flipped)
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CtaSliceSliceGreenBg = prismic.SharedSliceVariation<"greenBg", Simplify<CtaSliceSliceGreenBgPrimary>, never>;

/**
 * Slice variation for *CtaSlice*
 */
type CtaSliceSliceVariation = CtaSliceSliceDefault | CtaSliceSliceGreenBg

/**
 * CtaSlice Shared Slice
 *
 * - **API ID**: `cta_slice`
 * - **Description**: Full-width dark CTA banner with single heading, description, and action button
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CtaSliceSlice = prismic.SharedSlice<"cta_slice", CtaSliceSliceVariation>;

/**
 * Primary content in *FaqSlice → Default → Primary*
 */
export interface FaqSliceSliceDefaultPrimary {
	/**
	 * Heading field in *FaqSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Find Answers To Common Questions
	 * - **API ID Path**: faq_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Intro Text field in *FaqSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: We go beyond traditional HR outsourcing...
	 * - **API ID Path**: faq_slice.default.primary.intro_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	intro_text: prismic.KeyTextField;
	
	/**
	 * Side Image field in *FaqSlice → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: faq_slice.default.primary.side_image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	side_image: prismic.ImageField<never>;
	
	/**
	 * Anchor ID field in *FaqSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: faq
	 * - **API ID Path**: faq_slice.default.primary.anchor_id
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	anchor_id: prismic.KeyTextField;
}

/**
 * Primary content in *FaqSlice → Items*
 */
export interface FaqSliceSliceDefaultItem {
	/**
	 * Question field in *FaqSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: What industries do you specialize in?
	 * - **API ID Path**: faq_slice.items[].question
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	question: prismic.KeyTextField;
	
	/**
	 * Answer field in *FaqSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: We specialize in...
	 * - **API ID Path**: faq_slice.items[].answer
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	answer: prismic.KeyTextField;
}

/**
 * Default variation for FaqSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FaqSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<FaqSliceSliceDefaultPrimary>, Simplify<FaqSliceSliceDefaultItem>>;

/**
 * Slice variation for *FaqSlice*
 */
type FaqSliceSliceVariation = FaqSliceSliceDefault

/**
 * FaqSlice Shared Slice
 *
 * - **API ID**: `faq_slice`
 * - **Description**: FAQ section with two-column layout: heading/image left, accordion right
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FaqSliceSlice = prismic.SharedSlice<"faq_slice", FaqSliceSliceVariation>;

/**
 * Item in *FeatureRowsSlice → Default → Primary → Rows*
 */
export interface FeatureRowsSliceSliceDefaultPrimaryRowsItem {
	/**
	 * Image field in *FeatureRowsSlice → Default → Primary → Rows*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: feature_rows_slice.default.primary.rows[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Heading field in *FeatureRowsSlice → Default → Primary → Rows*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Feature heading
	 * - **API ID Path**: feature_rows_slice.default.primary.rows[].heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Description field in *FeatureRowsSlice → Default → Primary → Rows*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Describe this feature or benefit...
	 * - **API ID Path**: feature_rows_slice.default.primary.rows[].description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Button Label field in *FeatureRowsSlice → Default → Primary → Rows*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Learn More
	 * - **API ID Path**: feature_rows_slice.default.primary.rows[].button_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_label: prismic.KeyTextField;
	
	/**
	 * Button Link field in *FeatureRowsSlice → Default → Primary → Rows*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: feature_rows_slice.default.primary.rows[].button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Primary content in *FeatureRowsSlice → Default → Primary*
 */
export interface FeatureRowsSliceSliceDefaultPrimary {
	/**
	 * Sub Label field in *FeatureRowsSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Our Approach
	 * - **API ID Path**: feature_rows_slice.default.primary.sub_label
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	sub_label: prismic.RichTextField;
	
	/**
	 * Section Heading field in *FeatureRowsSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: How we partner with you
	 * - **API ID Path**: feature_rows_slice.default.primary.section_heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	section_heading: prismic.RichTextField;
	
	/**
	 * Rows field in *FeatureRowsSlice → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: feature_rows_slice.default.primary.rows[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	rows: prismic.GroupField<Simplify<FeatureRowsSliceSliceDefaultPrimaryRowsItem>>;
}

/**
 * Default variation for FeatureRowsSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Alternating image/content rows
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FeatureRowsSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<FeatureRowsSliceSliceDefaultPrimary>, never>;

/**
 * Slice variation for *FeatureRowsSlice*
 */
type FeatureRowsSliceSliceVariation = FeatureRowsSliceSliceDefault

/**
 * FeatureRowsSlice Shared Slice
 *
 * - **API ID**: `feature_rows_slice`
 * - **Description**: Alternating feature rows with image, heading, description, and CTA button
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FeatureRowsSliceSlice = prismic.SharedSlice<"feature_rows_slice", FeatureRowsSliceSliceVariation>;

/**
 * Primary content in *FeaturedBlogsSlice → Default → Primary*
 */
export interface FeaturedBlogsSliceSliceDefaultPrimary {
	/**
	 * Sub Label field in *FeaturedBlogsSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Our Blog
	 * - **API ID Path**: featured_blogs_slice.default.primary.sub_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	sub_label: prismic.KeyTextField;
	
	/**
	 * Heading field in *FeaturedBlogsSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: HR Insights And Trends To Help Your Business Grow
	 * - **API ID Path**: featured_blogs_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Number of Posts field in *FeaturedBlogsSlice → Default → Primary*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: 3
	 * - **API ID Path**: featured_blogs_slice.default.primary.post_count
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	post_count: prismic.NumberField;
}

/**
 * Default variation for FeaturedBlogsSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FeaturedBlogsSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<FeaturedBlogsSliceSliceDefaultPrimary>, never>;

/**
 * Slice variation for *FeaturedBlogsSlice*
 */
type FeaturedBlogsSliceSliceVariation = FeaturedBlogsSliceSliceDefault

/**
 * FeaturedBlogsSlice Shared Slice
 *
 * - **API ID**: `featured_blogs_slice`
 * - **Description**: Featured blog posts with sticky heading sidebar
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FeaturedBlogsSliceSlice = prismic.SharedSlice<"featured_blogs_slice", FeaturedBlogsSliceSliceVariation>;

/**
 * Primary content in *HeadingSlice → Default → Primary*
 */
export interface HeadingSliceSliceDefaultPrimary {
	/**
	 * Subtitle field in *HeadingSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Section label
	 * - **API ID Path**: heading_slice.default.primary.subtitle
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	subtitle: prismic.KeyTextField;
	
	/**
	 * Heading field in *HeadingSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A heading that fits the page
	 * - **API ID Path**: heading_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Heading Level field in *HeadingSlice → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: h2
	 * - **API ID Path**: heading_slice.default.primary.heading_level
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	heading_level: prismic.SelectField<"h1" | "h2" | "h3", "filled">;
	
	/**
	 * Alignment field in *HeadingSlice → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: left
	 * - **API ID Path**: heading_slice.default.primary.alignment
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	alignment: prismic.SelectField<"left" | "center" | "right", "filled">;
	
	/**
	 * Color field in *HeadingSlice → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: dark
	 * - **API ID Path**: heading_slice.default.primary.color
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	color: prismic.SelectField<"dark" | "white" | "primary" | "secondary", "filled">;
}

/**
 * Default variation for HeadingSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Standalone heading block
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeadingSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<HeadingSliceSliceDefaultPrimary>, never>;

/**
 * Slice variation for *HeadingSlice*
 */
type HeadingSliceSliceVariation = HeadingSliceSliceDefault

/**
 * HeadingSlice Shared Slice
 *
 * - **API ID**: `heading_slice`
 * - **Description**: Standalone heading with subtitle, alignment, level and color options
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeadingSliceSlice = prismic.SharedSlice<"heading_slice", HeadingSliceSliceVariation>;

/**
 * Item in *HeroSlice → Default → Primary → Rotating Words (last word)*
 */
export interface HeroSliceSliceDefaultPrimaryRotatingWordsItem {
	/**
	 * Word field in *HeroSlice → Default → Primary → Rotating Words (last word)*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: e.g. Companies
	 * - **API ID Path**: hero_slice.default.primary.rotating_words[].word
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	word: prismic.KeyTextField;
}

/**
 * Item in *HeroSlice → Default → Primary → Stats*
 */
export interface HeroSliceSliceDefaultPrimaryStatsItem {
	/**
	 * Value field in *HeroSlice → Default → Primary → Stats*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: 10K+
	 * - **API ID Path**: hero_slice.default.primary.stats[].value
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	value: prismic.KeyTextField;
	
	/**
	 * Label field in *HeroSlice → Default → Primary → Stats*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Talents Placed
	 * - **API ID Path**: hero_slice.default.primary.stats[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
}

/**
 * Item in *HeroSlice → Default → Primary → Reference Logos*
 */
export interface HeroSliceSliceDefaultPrimaryLogosItem {
	/**
	 * Logo Image field in *HeroSlice → Default → Primary → Reference Logos*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_slice.default.primary.logos[].logo
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	logo: prismic.ImageField<never>;
	
	/**
	 * Logo Name field in *HeroSlice → Default → Primary → Reference Logos*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Company Name
	 * - **API ID Path**: hero_slice.default.primary.logos[].logo_name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	logo_name: prismic.KeyTextField;
}

/**
 * Item in *HeroSlice → Default → Primary → Features*
 */
export interface HeroSliceSliceDefaultPrimaryFeaturesItem {
	/**
	 * Icon field in *HeroSlice → Default → Primary → Features*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_slice.default.primary.features[].icon
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	icon: prismic.ImageField<never>;
	
	/**
	 * Title field in *HeroSlice → Default → Primary → Features*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Cultural Fit
	 * - **API ID Path**: hero_slice.default.primary.features[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Description field in *HeroSlice → Default → Primary → Features*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Short feature description
	 * - **API ID Path**: hero_slice.default.primary.features[].description
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	description: prismic.KeyTextField;
}

/**
 * Item in *HeroSlice → Blue → Primary → Rotating Words (last word)*
 */
export interface HeroSliceSliceBluePrimaryRotatingWordsItem {
	/**
	 * Word field in *HeroSlice → Blue → Primary → Rotating Words (last word)*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: e.g. Companies
	 * - **API ID Path**: hero_slice.blue.primary.rotating_words[].word
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	word: prismic.KeyTextField;
}

/**
 * Item in *HeroSlice → Blue → Primary → Stats*
 */
export interface HeroSliceSliceBluePrimaryStatsItem {
	/**
	 * Value field in *HeroSlice → Blue → Primary → Stats*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: 10K+
	 * - **API ID Path**: hero_slice.blue.primary.stats[].value
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	value: prismic.KeyTextField;
	
	/**
	 * Label field in *HeroSlice → Blue → Primary → Stats*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Talents Placed
	 * - **API ID Path**: hero_slice.blue.primary.stats[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
}

/**
 * Item in *HeroSlice → Blue → Primary → Reference Logos*
 */
export interface HeroSliceSliceBluePrimaryLogosItem {
	/**
	 * Logo Image field in *HeroSlice → Blue → Primary → Reference Logos*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_slice.blue.primary.logos[].logo
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	logo: prismic.ImageField<never>;
	
	/**
	 * Logo Name field in *HeroSlice → Blue → Primary → Reference Logos*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Company Name
	 * - **API ID Path**: hero_slice.blue.primary.logos[].logo_name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	logo_name: prismic.KeyTextField;
}

/**
 * Item in *HeroSlice → Blue → Primary → Features*
 */
export interface HeroSliceSliceBluePrimaryFeaturesItem {
	/**
	 * Icon field in *HeroSlice → Blue → Primary → Features*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_slice.blue.primary.features[].icon
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	icon: prismic.ImageField<never>;
	
	/**
	 * Title field in *HeroSlice → Blue → Primary → Features*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Cultural Fit
	 * - **API ID Path**: hero_slice.blue.primary.features[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Description field in *HeroSlice → Blue → Primary → Features*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Short feature description
	 * - **API ID Path**: hero_slice.blue.primary.features[].description
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	description: prismic.KeyTextField;
}

/**
 * Primary content in *HeroSlice → Default → Primary*
 */
export interface HeroSliceSliceDefaultPrimary {
	/**
	 * Heading field in *HeroSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Connecting Top Talent With Leading Companies
	 * - **API ID Path**: hero_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Rotating Words (last word) field in *HeroSlice → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_slice.default.primary.rotating_words[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	rotating_words: prismic.GroupField<Simplify<HeroSliceSliceDefaultPrimaryRotatingWordsItem>>;
	
	/**
	 * Description field in *HeroSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Short description paragraph
	 * - **API ID Path**: hero_slice.default.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Primary Button field in *HeroSlice → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_slice.default.primary.button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Secondary Button field in *HeroSlice → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_slice.default.primary.button_link_2
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link_2: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Stats field in *HeroSlice → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_slice.default.primary.stats[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	stats: prismic.GroupField<Simplify<HeroSliceSliceDefaultPrimaryStatsItem>>;
	
	/**
	 * Reference Logos field in *HeroSlice → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_slice.default.primary.logos[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	logos: prismic.GroupField<Simplify<HeroSliceSliceDefaultPrimaryLogosItem>>;
	
	/**
	 * Features field in *HeroSlice → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_slice.default.primary.features[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	features: prismic.GroupField<Simplify<HeroSliceSliceDefaultPrimaryFeaturesItem>>;
}

/**
 * Default variation for HeroSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<HeroSliceSliceDefaultPrimary>, never>;

/**
 * Primary content in *HeroSlice → Blue → Primary*
 */
export interface HeroSliceSliceBluePrimary {
	/**
	 * Heading field in *HeroSlice → Blue → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Connecting Top Talent With Leading Companies
	 * - **API ID Path**: hero_slice.blue.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Rotating Words (last word) field in *HeroSlice → Blue → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_slice.blue.primary.rotating_words[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	rotating_words: prismic.GroupField<Simplify<HeroSliceSliceBluePrimaryRotatingWordsItem>>;
	
	/**
	 * Description field in *HeroSlice → Blue → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Short description paragraph
	 * - **API ID Path**: hero_slice.blue.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Primary Button field in *HeroSlice → Blue → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_slice.blue.primary.button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Secondary Button field in *HeroSlice → Blue → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_slice.blue.primary.button_link_2
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link_2: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Stats field in *HeroSlice → Blue → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_slice.blue.primary.stats[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	stats: prismic.GroupField<Simplify<HeroSliceSliceBluePrimaryStatsItem>>;
	
	/**
	 * Reference Logos field in *HeroSlice → Blue → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_slice.blue.primary.logos[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	logos: prismic.GroupField<Simplify<HeroSliceSliceBluePrimaryLogosItem>>;
	
	/**
	 * Features field in *HeroSlice → Blue → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_slice.blue.primary.features[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	features: prismic.GroupField<Simplify<HeroSliceSliceBluePrimaryFeaturesItem>>;
}

/**
 * Blue variation for HeroSlice Slice
 *
 * - **API ID**: `blue`
 * - **Description**: Blue accent variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSliceSliceBlue = prismic.SharedSliceVariation<"blue", Simplify<HeroSliceSliceBluePrimary>, never>;

/**
 * Slice variation for *HeroSlice*
 */
type HeroSliceSliceVariation = HeroSliceSliceDefault | HeroSliceSliceBlue

/**
 * HeroSlice Shared Slice
 *
 * - **API ID**: `hero_slice`
 * - **Description**: Main hero banner with heading, stats, description, CTAs, features and reference logos
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSliceSlice = prismic.SharedSlice<"hero_slice", HeroSliceSliceVariation>;

/**
 * Primary content in *ImageSlice → Default → Primary*
 */
export interface ImageSliceSliceDefaultPrimary {
	/**
	 * Image field in *ImageSlice → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: image_slice.default.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Caption field in *ImageSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Optional caption
	 * - **API ID Path**: image_slice.default.primary.caption
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	caption: prismic.KeyTextField;
	
	/**
	 * Width field in *ImageSlice → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: default
	 * - **API ID Path**: image_slice.default.primary.width
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	width: prismic.SelectField<"narrow" | "default" | "wide" | "full", "filled">;
	
	/**
	 * Alignment field in *ImageSlice → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: center
	 * - **API ID Path**: image_slice.default.primary.alignment
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	alignment: prismic.SelectField<"left" | "center" | "right", "filled">;
	
	/**
	 * Rounded corners field in *ImageSlice → Default → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **API ID Path**: image_slice.default.primary.rounded
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	rounded: prismic.BooleanField;
}

/**
 * Default variation for ImageSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Single image block
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ImageSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ImageSliceSliceDefaultPrimary>, never>;

/**
 * Slice variation for *ImageSlice*
 */
type ImageSliceSliceVariation = ImageSliceSliceDefault

/**
 * ImageSlice Shared Slice
 *
 * - **API ID**: `image_slice`
 * - **Description**: Single image with simple layout controls
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ImageSliceSlice = prismic.SharedSlice<"image_slice", ImageSliceSliceVariation>;

/**
 * Primary content in *NewsletterSlice → Default → Primary*
 */
export interface NewsletterSliceSliceDefaultPrimary {
	/**
	 * Heading field in *NewsletterSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Ready To Transform Your Hiring?
	 * - **API ID Path**: newsletter_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Description field in *NewsletterSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Short supporting text below the heading
	 * - **API ID Path**: newsletter_slice.default.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Button Label field in *NewsletterSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Subscribe
	 * - **API ID Path**: newsletter_slice.default.primary.button_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_label: prismic.KeyTextField;
	
	/**
	 * Background Color field in *NewsletterSlice → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: Choose background color
	 * - **Default Value**: primary
	 * - **API ID Path**: newsletter_slice.default.primary.bg_color
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	bg_color: prismic.SelectField<"primary" | "secondary" | "dark", "filled">;
	
	/**
	 * Brevo List ID field in *NewsletterSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: 12
	 * - **API ID Path**: newsletter_slice.default.primary.brevo_list_id
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	brevo_list_id: prismic.KeyTextField;
}

/**
 * Default variation for NewsletterSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: NewsletterSlice
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type NewsletterSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<NewsletterSliceSliceDefaultPrimary>, never>;

/**
 * Primary content in *NewsletterSlice → Blue → Primary*
 */
export interface NewsletterSliceSliceBluePrimary {
	/**
	 * Heading field in *NewsletterSlice → Blue → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Ready To Transform Your Hiring?
	 * - **API ID Path**: newsletter_slice.blue.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Description field in *NewsletterSlice → Blue → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Short supporting text below the heading
	 * - **API ID Path**: newsletter_slice.blue.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Button Label field in *NewsletterSlice → Blue → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Subscribe
	 * - **API ID Path**: newsletter_slice.blue.primary.button_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_label: prismic.KeyTextField;
	
	/**
	 * Background Color field in *NewsletterSlice → Blue → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: Choose background color
	 * - **Default Value**: primary
	 * - **API ID Path**: newsletter_slice.blue.primary.bg_color
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	bg_color: prismic.SelectField<"primary" | "secondary" | "dark", "filled">;
	
	/**
	 * Brevo List ID field in *NewsletterSlice → Blue → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: 12
	 * - **API ID Path**: newsletter_slice.blue.primary.brevo_list_id
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	brevo_list_id: prismic.KeyTextField;
}

/**
 * Blue variation for NewsletterSlice Slice
 *
 * - **API ID**: `blue`
 * - **Description**: Blue accent variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type NewsletterSliceSliceBlue = prismic.SharedSliceVariation<"blue", Simplify<NewsletterSliceSliceBluePrimary>, never>;

/**
 * Slice variation for *NewsletterSlice*
 */
type NewsletterSliceSliceVariation = NewsletterSliceSliceDefault | NewsletterSliceSliceBlue

/**
 * NewsletterSlice Shared Slice
 *
 * - **API ID**: `newsletter_slice`
 * - **Description**: Newsletter CTA section with email subscription
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type NewsletterSliceSlice = prismic.SharedSlice<"newsletter_slice", NewsletterSliceSliceVariation>;

/**
 * Primary content in *OurStorySlice → Default → Primary*
 */
export interface OurStorySliceSliceDefaultPrimary {
	/**
	 * Subheading field in *OurStorySlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Our Story
	 * - **API ID Path**: our_story_slice.default.primary.subheading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	subheading: prismic.KeyTextField;
	
	/**
	 * Heading field in *OurStorySlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: our_story_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Mission Title field in *OurStorySlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Our Mission
	 * - **API ID Path**: our_story_slice.default.primary.mission_title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	mission_title: prismic.KeyTextField;
	
	/**
	 * Mission Text field in *OurStorySlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: our_story_slice.default.primary.mission_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	mission_text: prismic.KeyTextField;
	
	/**
	 * Vision Title field in *OurStorySlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Our Vision
	 * - **API ID Path**: our_story_slice.default.primary.vision_title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	vision_title: prismic.KeyTextField;
	
	/**
	 * Vision Text field in *OurStorySlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: our_story_slice.default.primary.vision_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	vision_text: prismic.KeyTextField;
	
	/**
	 * More About Link field in *OurStorySlice → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: our_story_slice.default.primary.more_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	more_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Years Number field in *OurStorySlice → Default → Primary*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: 15
	 * - **API ID Path**: our_story_slice.default.primary.years
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	years: prismic.NumberField;
	
	/**
	 * Years Label field in *OurStorySlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Years Of Excellence
	 * - **API ID Path**: our_story_slice.default.primary.years_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	years_label: prismic.KeyTextField;
	
	/**
	 * Image 1 field in *OurStorySlice → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: our_story_slice.default.primary.image_1
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image_1: prismic.ImageField<never>;
	
	/**
	 * Image 2 field in *OurStorySlice → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: our_story_slice.default.primary.image_2
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image_2: prismic.ImageField<never>;
}

/**
 * Default variation for OurStorySlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type OurStorySliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<OurStorySliceSliceDefaultPrimary>, never>;

/**
 * Primary content in *OurStorySlice → Blue → Primary*
 */
export interface OurStorySliceSliceBluePrimary {
	/**
	 * Subheading field in *OurStorySlice → Blue → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Our Story
	 * - **API ID Path**: our_story_slice.blue.primary.subheading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	subheading: prismic.KeyTextField;
	
	/**
	 * Heading field in *OurStorySlice → Blue → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: our_story_slice.blue.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Mission Title field in *OurStorySlice → Blue → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Our Mission
	 * - **API ID Path**: our_story_slice.blue.primary.mission_title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	mission_title: prismic.KeyTextField;
	
	/**
	 * Mission Text field in *OurStorySlice → Blue → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: our_story_slice.blue.primary.mission_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	mission_text: prismic.KeyTextField;
	
	/**
	 * Vision Title field in *OurStorySlice → Blue → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Our Vision
	 * - **API ID Path**: our_story_slice.blue.primary.vision_title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	vision_title: prismic.KeyTextField;
	
	/**
	 * Vision Text field in *OurStorySlice → Blue → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: our_story_slice.blue.primary.vision_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	vision_text: prismic.KeyTextField;
	
	/**
	 * More About Link field in *OurStorySlice → Blue → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: our_story_slice.blue.primary.more_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	more_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Years Number field in *OurStorySlice → Blue → Primary*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: 15
	 * - **API ID Path**: our_story_slice.blue.primary.years
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	years: prismic.NumberField;
	
	/**
	 * Years Label field in *OurStorySlice → Blue → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Years Of Excellence
	 * - **API ID Path**: our_story_slice.blue.primary.years_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	years_label: prismic.KeyTextField;
	
	/**
	 * Image 1 field in *OurStorySlice → Blue → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: our_story_slice.blue.primary.image_1
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image_1: prismic.ImageField<never>;
	
	/**
	 * Image 2 field in *OurStorySlice → Blue → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: our_story_slice.blue.primary.image_2
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image_2: prismic.ImageField<never>;
}

/**
 * Blue variation for OurStorySlice Slice
 *
 * - **API ID**: `blue`
 * - **Description**: Blue accent variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type OurStorySliceSliceBlue = prismic.SharedSliceVariation<"blue", Simplify<OurStorySliceSliceBluePrimary>, never>;

/**
 * Slice variation for *OurStorySlice*
 */
type OurStorySliceSliceVariation = OurStorySliceSliceDefault | OurStorySliceSliceBlue

/**
 * OurStorySlice Shared Slice
 *
 * - **API ID**: `our_story_slice`
 * - **Description**: Our Story section with heading, mission/vision blocks, images and years counter
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type OurStorySliceSlice = prismic.SharedSlice<"our_story_slice", OurStorySliceSliceVariation>;

/**
 * Primary content in *ProcessSlice → Default → Primary*
 */
export interface ProcessSliceSliceDefaultPrimary {
	/**
	 * Heading field in *ProcessSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Proces
	 * - **API ID Path**: process_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Show Step Numbers field in *ProcessSlice → Default → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: true
	 * - **API ID Path**: process_slice.default.primary.show_step_numbers
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	show_step_numbers: prismic.BooleanField;
}

/**
 * Primary content in *ProcessSlice → Items*
 */
export interface ProcessSliceSliceDefaultItem {
	/**
	 * Icon field in *ProcessSlice → Items*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: process_slice.items[].icon
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	icon: prismic.SelectField<"id-card" | "handshake" | "employee-3" | "job-search-1" | "management-2" | "user" | "recruitment" | "hiring" | "hiring-1" | "candidate" | "candidates" | "candidates-1" | "employee" | "employee-1" | "employee-2" | "management" | "management-1" | "job-search" | "job-search-2" | "job-search-3" | "resume" | "resume-1" | "resume-2" | "profile" | "profile-1" | "profiles" | "time-management" | "presentation" | "award" | "hierarchical-structure" | "conversation" | "conversation-1" | "trophy" | "puzzle" | "puzzle-1" | "work-team" | "finances" | "leadership" | "skills" | "email" | "email-1" | "analytics" | "target" | "target-1" | "strategy" | "problems" | "podium" | "podium-1" | "profits" | "calendar" | "calendar-1" | "portfolio" | "list" | "pension" | "deal" | "diploma" | "salary" | "promotion" | "project-management" | "conveyor" | "stats" | "education" | "team" | "team-1" | "folder" | "goal" | "dollar" | "pay" | "task-list" | "briefcase" | "search" | "identity" | "talking" | "interview" | "interview-1" | "agreement" | "diagram" | "diagram-1" | "badge" | "laptop" | "life-guard" | "link" | "hierarchy" | "hierarchy-1" | "hierarchy-2" | "transfer" | "account" | "brain" | "shield" | "connect" | "connect-1" | "pin" | "tie" | "diamond" | "eye" | "man" | "clock" | "user-1" | "faq" | "support" | "calculator" | "setting" | "directory" | "analyzing" | "flight" | "contract" | "orbit" | "pie-chart" | "business-proposal" | "trust" | "solution" | "continuous-improvement" | "relationships" | "analysis" | "public-health" | "social-security" | "idea" | "idea-1" | "compassion" | "infographics" | "experts" | "relationship" | "need-assessment" | "diversity" | "approach" | "timer" | "digital-transformation" | "marketplace" | "partnership" | "scenic">;
	
	/**
	 * Title field in *ProcessSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Access Hidden Opportunities
	 * - **API ID Path**: process_slice.items[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Description field in *ProcessSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: process_slice.items[].description
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	description: prismic.KeyTextField;
}

/**
 * Default variation for ProcessSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProcessSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ProcessSliceSliceDefaultPrimary>, Simplify<ProcessSliceSliceDefaultItem>>;

/**
 * Primary content in *ProcessSlice → Blue → Primary*
 */
export interface ProcessSliceSliceBluePrimary {
	/**
	 * Heading field in *ProcessSlice → Blue → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Proces
	 * - **API ID Path**: process_slice.blue.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Show Step Numbers field in *ProcessSlice → Blue → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: true
	 * - **API ID Path**: process_slice.blue.primary.show_step_numbers
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	show_step_numbers: prismic.BooleanField;
}

/**
 * Primary content in *ProcessSlice → Items*
 */
export interface ProcessSliceSliceBlueItem {
	/**
	 * Icon field in *ProcessSlice → Items*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: process_slice.items[].icon
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	icon: prismic.SelectField<"id-card" | "handshake" | "employee-3" | "job-search-1" | "management-2" | "user" | "recruitment" | "hiring" | "hiring-1" | "candidate" | "candidates" | "candidates-1" | "employee" | "employee-1" | "employee-2" | "management" | "management-1" | "job-search" | "job-search-2" | "job-search-3" | "resume" | "resume-1" | "resume-2" | "profile" | "profile-1" | "profiles" | "time-management" | "presentation" | "award" | "hierarchical-structure" | "conversation" | "conversation-1" | "trophy" | "puzzle" | "puzzle-1" | "work-team" | "finances" | "leadership" | "skills" | "email" | "email-1" | "analytics" | "target" | "target-1" | "strategy" | "problems" | "podium" | "podium-1" | "profits" | "calendar" | "calendar-1" | "portfolio" | "list" | "pension" | "deal" | "diploma" | "salary" | "promotion" | "project-management" | "conveyor" | "stats" | "education" | "team" | "team-1" | "folder" | "goal" | "dollar" | "pay" | "task-list" | "briefcase" | "search" | "identity" | "talking" | "interview" | "interview-1" | "agreement" | "diagram" | "diagram-1" | "badge" | "laptop" | "life-guard" | "link" | "hierarchy" | "hierarchy-1" | "hierarchy-2" | "transfer" | "account" | "brain" | "shield" | "connect" | "connect-1" | "pin" | "tie" | "diamond" | "eye" | "man" | "clock" | "user-1" | "faq" | "support" | "calculator" | "setting" | "directory" | "analyzing" | "flight" | "contract" | "orbit" | "pie-chart" | "business-proposal" | "trust" | "solution" | "continuous-improvement" | "relationships" | "analysis" | "public-health" | "social-security" | "idea" | "idea-1" | "compassion" | "infographics" | "experts" | "relationship" | "need-assessment" | "diversity" | "approach" | "timer" | "digital-transformation" | "marketplace" | "partnership" | "scenic">;
	
	/**
	 * Title field in *ProcessSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Access Hidden Opportunities
	 * - **API ID Path**: process_slice.items[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Description field in *ProcessSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: process_slice.items[].description
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	description: prismic.KeyTextField;
}

/**
 * Blue variation for ProcessSlice Slice
 *
 * - **API ID**: `blue`
 * - **Description**: Blue accent variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProcessSliceSliceBlue = prismic.SharedSliceVariation<"blue", Simplify<ProcessSliceSliceBluePrimary>, Simplify<ProcessSliceSliceBlueItem>>;

/**
 * Slice variation for *ProcessSlice*
 */
type ProcessSliceSliceVariation = ProcessSliceSliceDefault | ProcessSliceSliceBlue

/**
 * ProcessSlice Shared Slice
 *
 * - **API ID**: `process_slice`
 * - **Description**: Overview/process cards section with heading and 4 cards
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProcessSliceSlice = prismic.SharedSlice<"process_slice", ProcessSliceSliceVariation>;

/**
 * Primary content in *RoiCalculatorSlice → Default → Primary*
 */
export interface RoiCalculatorSliceSliceDefaultPrimary {
	/**
	 * Section label field in *RoiCalculatorSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: KALKULATOR ROI
	 * - **API ID Path**: roi_calculator_slice.default.primary.section_label
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	section_label: prismic.RichTextField;
	
	/**
	 * Heading field in *RoiCalculatorSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Izračunajte povrat vaše investicije
	 * - **API ID Path**: roi_calculator_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Description field in *RoiCalculatorSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Unesite podatke o vašoj organizaciji za personalizirani prikaz.
	 * - **API ID Path**: roi_calculator_slice.default.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Disclaimer (optional override) field in *RoiCalculatorSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Procjene se temelje na pretpostavci...
	 * - **API ID Path**: roi_calculator_slice.default.primary.disclaimer
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	disclaimer: prismic.RichTextField;
}

/**
 * Default variation for RoiCalculatorSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variant
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RoiCalculatorSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<RoiCalculatorSliceSliceDefaultPrimary>, never>;

/**
 * Slice variation for *RoiCalculatorSlice*
 */
type RoiCalculatorSliceSliceVariation = RoiCalculatorSliceSliceDefault

/**
 * RoiCalculatorSlice Shared Slice
 *
 * - **API ID**: `roi_calculator_slice`
 * - **Description**: Interactive ROI calculator for recruitment savings
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RoiCalculatorSliceSlice = prismic.SharedSlice<"roi_calculator_slice", RoiCalculatorSliceSliceVariation>;

/**
 * Item in *ServicesSlice → Default → Primary → Service Cards*
 */
export interface ServicesSliceSliceDefaultPrimaryItemsItem {
	/**
	 * Title field in *ServicesSlice → Default → Primary → Service Cards*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Permanent Recruitment
	 * - **API ID Path**: services_slice.default.primary.items[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Description field in *ServicesSlice → Default → Primary → Service Cards*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Full-cycle recruitment for permanent positions.
	 * - **API ID Path**: services_slice.default.primary.items[].description
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	description: prismic.KeyTextField;
	
	/**
	 * Link field in *ServicesSlice → Default → Primary → Service Cards*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: services_slice.default.primary.items[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Icon field in *ServicesSlice → Default → Primary → Service Cards*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: services_slice.default.primary.items[].icon
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	icon: prismic.SelectField<"id-card" | "handshake" | "employee-3" | "job-search-1" | "management-2" | "user" | "recruitment" | "hiring" | "hiring-1" | "candidate" | "candidates" | "candidates-1" | "employee" | "employee-1" | "employee-2" | "management" | "management-1" | "job-search" | "job-search-2" | "job-search-3" | "resume" | "resume-1" | "resume-2" | "profile" | "profile-1" | "profiles" | "time-management" | "presentation" | "award" | "hierarchical-structure" | "conversation" | "conversation-1" | "trophy" | "puzzle" | "puzzle-1" | "work-team" | "finances" | "leadership" | "skills" | "email" | "email-1" | "analytics" | "target" | "target-1" | "strategy" | "problems" | "podium" | "podium-1" | "profits" | "calendar" | "calendar-1" | "portfolio" | "list" | "pension" | "deal" | "diploma" | "salary" | "promotion" | "project-management" | "conveyor" | "stats" | "education" | "team" | "team-1" | "folder" | "goal" | "dollar" | "pay" | "task-list" | "briefcase" | "search" | "identity" | "talking" | "interview" | "interview-1" | "agreement" | "diagram" | "diagram-1" | "badge" | "laptop" | "life-guard" | "link" | "hierarchy" | "hierarchy-1" | "hierarchy-2" | "transfer" | "account" | "brain" | "shield" | "connect" | "connect-1" | "pin" | "tie" | "diamond" | "eye" | "man" | "clock" | "user-1" | "faq" | "support" | "calculator" | "setting" | "directory" | "analyzing" | "flight" | "contract" | "orbit" | "pie-chart" | "business-proposal" | "trust" | "solution" | "continuous-improvement" | "relationships" | "analysis" | "public-health" | "social-security" | "idea" | "idea-1" | "compassion" | "infographics" | "experts" | "relationship" | "need-assessment" | "diversity" | "approach" | "timer" | "digital-transformation" | "marketplace" | "partnership" | "scenic">;
}

/**
 * Item in *ServicesSlice → Blue → Primary → Service Cards*
 */
export interface ServicesSliceSliceBluePrimaryItemsItem {
	/**
	 * Title field in *ServicesSlice → Blue → Primary → Service Cards*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Permanent Recruitment
	 * - **API ID Path**: services_slice.blue.primary.items[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Description field in *ServicesSlice → Blue → Primary → Service Cards*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Full-cycle recruitment for permanent positions.
	 * - **API ID Path**: services_slice.blue.primary.items[].description
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	description: prismic.KeyTextField;
	
	/**
	 * Link field in *ServicesSlice → Blue → Primary → Service Cards*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: services_slice.blue.primary.items[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Icon field in *ServicesSlice → Blue → Primary → Service Cards*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: services_slice.blue.primary.items[].icon
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	icon: prismic.SelectField<"id-card" | "handshake" | "employee-3" | "job-search-1" | "management-2" | "user" | "recruitment" | "hiring" | "hiring-1" | "candidate" | "candidates" | "candidates-1" | "employee" | "employee-1" | "employee-2" | "management" | "management-1" | "job-search" | "job-search-2" | "job-search-3" | "resume" | "resume-1" | "resume-2" | "profile" | "profile-1" | "profiles" | "time-management" | "presentation" | "award" | "hierarchical-structure" | "conversation" | "conversation-1" | "trophy" | "puzzle" | "puzzle-1" | "work-team" | "finances" | "leadership" | "skills" | "email" | "email-1" | "analytics" | "target" | "target-1" | "strategy" | "problems" | "podium" | "podium-1" | "profits" | "calendar" | "calendar-1" | "portfolio" | "list" | "pension" | "deal" | "diploma" | "salary" | "promotion" | "project-management" | "conveyor" | "stats" | "education" | "team" | "team-1" | "folder" | "goal" | "dollar" | "pay" | "task-list" | "briefcase" | "search" | "identity" | "talking" | "interview" | "interview-1" | "agreement" | "diagram" | "diagram-1" | "badge" | "laptop" | "life-guard" | "link" | "hierarchy" | "hierarchy-1" | "hierarchy-2" | "transfer" | "account" | "brain" | "shield" | "connect" | "connect-1" | "pin" | "tie" | "diamond" | "eye" | "man" | "clock" | "user-1" | "faq" | "support" | "calculator" | "setting" | "directory" | "analyzing" | "flight" | "contract" | "orbit" | "pie-chart" | "business-proposal" | "trust" | "solution" | "continuous-improvement" | "relationships" | "analysis" | "public-health" | "social-security" | "idea" | "idea-1" | "compassion" | "infographics" | "experts" | "relationship" | "need-assessment" | "diversity" | "approach" | "timer" | "digital-transformation" | "marketplace" | "partnership" | "scenic">;
}

/**
 * Primary content in *ServicesSlice → Default → Primary*
 */
export interface ServicesSliceSliceDefaultPrimary {
	/**
	 * Heading field in *ServicesSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Comprehensive Recruitment Solutions
	 * - **API ID Path**: services_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Tagline field in *ServicesSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: What We Offer
	 * - **API ID Path**: services_slice.default.primary.tagline
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	tagline: prismic.KeyTextField;
	
	/**
	 * Service Cards field in *ServicesSlice → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: services_slice.default.primary.items[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	items: prismic.GroupField<Simplify<ServicesSliceSliceDefaultPrimaryItemsItem>>;
}

/**
 * Default variation for ServicesSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ServicesSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ServicesSliceSliceDefaultPrimary>, never>;

/**
 * Primary content in *ServicesSlice → Blue → Primary*
 */
export interface ServicesSliceSliceBluePrimary {
	/**
	 * Heading field in *ServicesSlice → Blue → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Comprehensive Recruitment Solutions
	 * - **API ID Path**: services_slice.blue.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Tagline field in *ServicesSlice → Blue → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: What We Offer
	 * - **API ID Path**: services_slice.blue.primary.tagline
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	tagline: prismic.KeyTextField;
	
	/**
	 * Service Cards field in *ServicesSlice → Blue → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: services_slice.blue.primary.items[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	items: prismic.GroupField<Simplify<ServicesSliceSliceBluePrimaryItemsItem>>;
}

/**
 * Blue variation for ServicesSlice Slice
 *
 * - **API ID**: `blue`
 * - **Description**: Blue accent variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ServicesSliceSliceBlue = prismic.SharedSliceVariation<"blue", Simplify<ServicesSliceSliceBluePrimary>, never>;

/**
 * Slice variation for *ServicesSlice*
 */
type ServicesSliceSliceVariation = ServicesSliceSliceDefault | ServicesSliceSliceBlue

/**
 * ServicesSlice Shared Slice
 *
 * - **API ID**: `services_slice`
 * - **Description**: Services grid section with section heading and repeatable service cards
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ServicesSliceSlice = prismic.SharedSlice<"services_slice", ServicesSliceSliceVariation>;

/**
 * Primary content in *SmallHeroSlice → Default → Primary*
 */
export interface SmallHeroSliceSliceDefaultPrimary {
	/**
	 * Heading field in *SmallHeroSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Case Studies
	 * - **API ID Path**: small_hero_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
}

/**
 * Default variation for SmallHeroSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type SmallHeroSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<SmallHeroSliceSliceDefaultPrimary>, never>;

/**
 * Slice variation for *SmallHeroSlice*
 */
type SmallHeroSliceSliceVariation = SmallHeroSliceSliceDefault

/**
 * SmallHeroSlice Shared Slice
 *
 * - **API ID**: `small_hero_slice`
 * - **Description**: Compact hero for inner pages
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type SmallHeroSliceSlice = prismic.SharedSlice<"small_hero_slice", SmallHeroSliceSliceVariation>;

/**
 * Primary content in *TeamSlice → Default → Primary*
 */
export interface TeamSliceSliceDefaultPrimary {
	/**
	 * Tagline field in *TeamSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Our Team
	 * - **API ID Path**: team_slice.default.primary.tagline
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	tagline: prismic.KeyTextField;
	
	/**
	 * Heading field in *TeamSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Meet The Team
	 * - **API ID Path**: team_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
}

/**
 * Primary content in *TeamSlice → Items*
 */
export interface TeamSliceSliceDefaultItem {
	/**
	 * Photo field in *TeamSlice → Items*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: team_slice.items[].photo
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	photo: prismic.ImageField<never>;
	
	/**
	 * Name field in *TeamSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Full Name
	 * - **API ID Path**: team_slice.items[].name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	name: prismic.KeyTextField;
	
	/**
	 * Role field in *TeamSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Job Title
	 * - **API ID Path**: team_slice.items[].role
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	role: prismic.KeyTextField;
	
	/**
	 * LinkedIn URL field in *TeamSlice → Items*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: team_slice.items[].linkedin_url
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	linkedin_url: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Twitter / X URL field in *TeamSlice → Items*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: team_slice.items[].twitter_url
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	twitter_url: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Facebook URL field in *TeamSlice → Items*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: team_slice.items[].facebook_url
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	facebook_url: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Default variation for TeamSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type TeamSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<TeamSliceSliceDefaultPrimary>, Simplify<TeamSliceSliceDefaultItem>>;

/**
 * Slice variation for *TeamSlice*
 */
type TeamSliceSliceVariation = TeamSliceSliceDefault

/**
 * TeamSlice Shared Slice
 *
 * - **API ID**: `team_slice`
 * - **Description**: Team member grid
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type TeamSliceSlice = prismic.SharedSlice<"team_slice", TeamSliceSliceVariation>;

/**
 * Primary content in *TestimonialsSlice → Default → Primary*
 */
export interface TestimonialsSliceSliceDefaultPrimary {
	/**
	 * Tagline field in *TestimonialsSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Testimonial
	 * - **API ID Path**: testimonials_slice.default.primary.tagline
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	tagline: prismic.KeyTextField;
	
	/**
	 * Heading field in *TestimonialsSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: See What Our Partners Say
	 * - **API ID Path**: testimonials_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
}

/**
 * Primary content in *TestimonialsSlice → Items*
 */
export interface TestimonialsSliceSliceDefaultItem {
	/**
	 * Category field in *TestimonialsSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Company
	 * - **API ID Path**: testimonials_slice.items[].category
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	category: prismic.KeyTextField;
	
	/**
	 * Quote field in *TestimonialsSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: They found us a perfect match...
	 * - **API ID Path**: testimonials_slice.items[].quote
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	quote: prismic.KeyTextField;
	
	/**
	 * Author Name field in *TestimonialsSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Jane Smith
	 * - **API ID Path**: testimonials_slice.items[].author_name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	author_name: prismic.KeyTextField;
	
	/**
	 * Author Role field in *TestimonialsSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: CEO
	 * - **API ID Path**: testimonials_slice.items[].author_role
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	author_role: prismic.KeyTextField;
	
	/**
	 * Author Image field in *TestimonialsSlice → Items*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: testimonials_slice.items[].author_image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	author_image: prismic.ImageField<never>;
}

/**
 * Default variation for TestimonialsSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type TestimonialsSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<TestimonialsSliceSliceDefaultPrimary>, Simplify<TestimonialsSliceSliceDefaultItem>>;

/**
 * Slice variation for *TestimonialsSlice*
 */
type TestimonialsSliceSliceVariation = TestimonialsSliceSliceDefault

/**
 * TestimonialsSlice Shared Slice
 *
 * - **API ID**: `testimonials_slice`
 * - **Description**: Testimonials section with cards grid
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type TestimonialsSliceSlice = prismic.SharedSlice<"testimonials_slice", TestimonialsSliceSliceVariation>;

/**
 * Item in *TestsSlice → Default → Primary → Cards*
 */
export interface TestsSliceSliceDefaultPrimaryCardsItem {
	/**
	 * Title field in *TestsSlice → Default → Primary → Cards*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Kognitivni testovi
	 * - **API ID Path**: tests_slice.default.primary.cards[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Subtitle field in *TestsSlice → Default → Primary → Cards*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Mental Abilities
	 * - **API ID Path**: tests_slice.default.primary.cards[].subtitle
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	subtitle: prismic.KeyTextField;
	
	/**
	 * Image field in *TestsSlice → Default → Primary → Cards*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: tests_slice.default.primary.cards[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Link field in *TestsSlice → Default → Primary → Cards*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: tests_slice.default.primary.cards[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Primary content in *TestsSlice → Default → Primary*
 */
export interface TestsSliceSliceDefaultPrimary {
	/**
	 * Tagline field in *TestsSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Scouthem Platform
	 * - **API ID Path**: tests_slice.default.primary.tagline
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	tagline: prismic.KeyTextField;
	
	/**
	 * Heading field in *TestsSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Discover the Depth and Variety of Our Test Library
	 * - **API ID Path**: tests_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Cards field in *TestsSlice → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: tests_slice.default.primary.cards[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	cards: prismic.GroupField<Simplify<TestsSliceSliceDefaultPrimaryCardsItem>>;
}

/**
 * Default variation for TestsSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type TestsSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<TestsSliceSliceDefaultPrimary>, never>;

/**
 * Slice variation for *TestsSlice*
 */
type TestsSliceSliceVariation = TestsSliceSliceDefault

/**
 * TestsSlice Shared Slice
 *
 * - **API ID**: `tests_slice`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type TestsSliceSlice = prismic.SharedSlice<"tests_slice", TestsSliceSliceVariation>;

/**
 * Primary content in *VideoSlice → Default → Primary*
 */
export interface VideoSliceSliceDefaultPrimary {
	/**
	 * YouTube URL field in *VideoSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: https://www.youtube.com/watch?v=...
	 * - **API ID Path**: video_slice.default.primary.youtube_url
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	youtube_url: prismic.KeyTextField;
	
	/**
	 * Video Title field in *VideoSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Optional video title
	 * - **API ID Path**: video_slice.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Caption field in *VideoSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Optional caption below the video
	 * - **API ID Path**: video_slice.default.primary.caption
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	caption: prismic.KeyTextField;
}

/**
 * Default variation for VideoSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Full-width YouTube embed
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type VideoSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<VideoSliceSliceDefaultPrimary>, never>;

/**
 * Slice variation for *VideoSlice*
 */
type VideoSliceSliceVariation = VideoSliceSliceDefault

/**
 * VideoSlice Shared Slice
 *
 * - **API ID**: `video_slice`
 * - **Description**: Full-width YouTube video embed with lazy-loaded thumbnail
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type VideoSliceSlice = prismic.SharedSlice<"video_slice", VideoSliceSliceVariation>;

/**
 * Primary content in *WebinarFormSlice → Default → Primary*
 */
export interface WebinarFormSliceSliceDefaultPrimary {
	/**
	 * Heading field in *WebinarFormSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Prijavite se na sljedeći webinar
	 * - **API ID Path**: webinar_form_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Description field in *WebinarFormSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Ispunite obrazac i obavijestit ćemo vas o nadolazećim webinarima.
	 * - **API ID Path**: webinar_form_slice.default.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	description: prismic.KeyTextField;
	
	/**
	 * Submit Button Label field in *WebinarFormSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Prijavi se
	 * - **API ID Path**: webinar_form_slice.default.primary.submit_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	submit_label: prismic.KeyTextField;
	
	/**
	 * Brevo List ID field in *WebinarFormSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: 12
	 * - **API ID Path**: webinar_form_slice.default.primary.brevo_list_id
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	brevo_list_id: prismic.KeyTextField;
	
	/**
	 * Consent Label field in *WebinarFormSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Slažem se s uvjetima korištenja i politikom privatnosti.
	 * - **API ID Path**: webinar_form_slice.default.primary.consent_label
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	consent_label: prismic.RichTextField;
}

/**
 * Default variation for WebinarFormSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type WebinarFormSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<WebinarFormSliceSliceDefaultPrimary>, never>;

/**
 * Slice variation for *WebinarFormSlice*
 */
type WebinarFormSliceSliceVariation = WebinarFormSliceSliceDefault

/**
 * WebinarFormSlice Shared Slice
 *
 * - **API ID**: `webinar_form_slice`
 * - **Description**: Webinar registration form connected to Brevo
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type WebinarFormSliceSlice = prismic.SharedSlice<"webinar_form_slice", WebinarFormSliceSliceVariation>;

/**
 * Primary content in *WebinarListSlice → Default → Primary*
 */
export interface WebinarListSliceSliceDefaultPrimary {
	/**
	 * Tagline field in *WebinarListSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Webinari
	 * - **API ID Path**: webinar_list_slice.default.primary.tagline
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	tagline: prismic.KeyTextField;
	
	/**
	 * Heading field in *WebinarListSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Pogledajte naše snimke webinara
	 * - **API ID Path**: webinar_list_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Description field in *WebinarListSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Kratki uvod u sekciju webinara
	 * - **API ID Path**: webinar_list_slice.default.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	description: prismic.KeyTextField;
}

/**
 * Primary content in *WebinarListSlice → Items*
 */
export interface WebinarListSliceSliceDefaultItem {
	/**
	 * Title field in *WebinarListSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Naziv webinara
	 * - **API ID Path**: webinar_list_slice.items[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Short Description field in *WebinarListSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Kratki opis webinara
	 * - **API ID Path**: webinar_list_slice.items[].short_description
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	short_description: prismic.KeyTextField;
	
	/**
	 * YouTube URL field in *WebinarListSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: https://www.youtube.com/watch?v=...
	 * - **API ID Path**: webinar_list_slice.items[].youtube_url
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	youtube_url: prismic.KeyTextField;
}

/**
 * Default variation for WebinarListSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type WebinarListSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<WebinarListSliceSliceDefaultPrimary>, Simplify<WebinarListSliceSliceDefaultItem>>;

/**
 * Slice variation for *WebinarListSlice*
 */
type WebinarListSliceSliceVariation = WebinarListSliceSliceDefault

/**
 * WebinarListSlice Shared Slice
 *
 * - **API ID**: `webinar_list_slice`
 * - **Description**: Grid of webinar cards linking to YouTube videos
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type WebinarListSliceSlice = prismic.SharedSlice<"webinar_list_slice", WebinarListSliceSliceVariation>;

/**
 * Primary content in *WhyChooseSlice → Default → Primary*
 */
export interface WhyChooseSliceSliceDefaultPrimary {
	/**
	 * Subheading field in *WhyChooseSlice → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Our Story
	 * - **API ID Path**: why_choose_slice.default.primary.subheading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	subheading: prismic.KeyTextField;
	
	/**
	 * Heading field in *WhyChooseSlice → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: why_choose_slice.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Left Image field in *WhyChooseSlice → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: why_choose_slice.default.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Primary content in *WhyChooseSlice → Items*
 */
export interface WhyChooseSliceSliceDefaultItem {
	/**
	 * Icon field in *WhyChooseSlice → Items*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: why_choose_slice.items[].icon
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	icon: prismic.SelectField<"id-card" | "handshake" | "employee-3" | "job-search-1" | "management-2" | "user" | "recruitment" | "hiring" | "hiring-1" | "candidate" | "candidates" | "candidates-1" | "employee" | "employee-1" | "employee-2" | "management" | "management-1" | "job-search" | "job-search-2" | "job-search-3" | "resume" | "resume-1" | "resume-2" | "profile" | "profile-1" | "profiles" | "time-management" | "presentation" | "award" | "hierarchical-structure" | "conversation" | "conversation-1" | "trophy" | "puzzle" | "puzzle-1" | "work-team" | "finances" | "leadership" | "skills" | "email" | "email-1" | "analytics" | "target" | "target-1" | "strategy" | "problems" | "podium" | "podium-1" | "profits" | "calendar" | "calendar-1" | "portfolio" | "list" | "pension" | "deal" | "diploma" | "salary" | "promotion" | "project-management" | "conveyor" | "stats" | "education" | "team" | "team-1" | "folder" | "goal" | "dollar" | "pay" | "task-list" | "briefcase" | "search" | "identity" | "talking" | "interview" | "interview-1" | "agreement" | "diagram" | "diagram-1" | "badge" | "laptop" | "life-guard" | "link" | "hierarchy" | "hierarchy-1" | "hierarchy-2" | "transfer" | "account" | "brain" | "shield" | "connect" | "connect-1" | "pin" | "tie" | "diamond" | "eye" | "man" | "clock" | "user-1" | "faq" | "support" | "calculator" | "setting" | "directory" | "analyzing" | "flight" | "contract" | "orbit" | "pie-chart" | "business-proposal" | "trust" | "solution" | "continuous-improvement" | "relationships" | "analysis" | "public-health" | "social-security" | "idea" | "idea-1" | "compassion" | "infographics" | "experts" | "relationship" | "need-assessment" | "diversity" | "approach" | "timer" | "digital-transformation" | "marketplace" | "partnership" | "scenic">;
	
	/**
	 * Title field in *WhyChooseSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: AI-Powered
	 * - **API ID Path**: why_choose_slice.items[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Title Highlight field in *WhyChooseSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Talent Matching
	 * - **API ID Path**: why_choose_slice.items[].title_highlight
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title_highlight: prismic.KeyTextField;
	
	/**
	 * Description field in *WhyChooseSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: why_choose_slice.items[].description
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	description: prismic.KeyTextField;
}

/**
 * Default variation for WhyChooseSlice Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type WhyChooseSliceSliceDefault = prismic.SharedSliceVariation<"default", Simplify<WhyChooseSliceSliceDefaultPrimary>, Simplify<WhyChooseSliceSliceDefaultItem>>;

/**
 * Primary content in *WhyChooseSlice → Blue → Primary*
 */
export interface WhyChooseSliceSliceBluePrimary {
	/**
	 * Subheading field in *WhyChooseSlice → Blue → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Our Story
	 * - **API ID Path**: why_choose_slice.blue.primary.subheading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	subheading: prismic.KeyTextField;
	
	/**
	 * Heading field in *WhyChooseSlice → Blue → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: why_choose_slice.blue.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Left Image field in *WhyChooseSlice → Blue → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: why_choose_slice.blue.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Primary content in *WhyChooseSlice → Items*
 */
export interface WhyChooseSliceSliceBlueItem {
	/**
	 * Icon field in *WhyChooseSlice → Items*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: why_choose_slice.items[].icon
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	icon: prismic.SelectField<"id-card" | "handshake" | "employee-3" | "job-search-1" | "management-2" | "user" | "recruitment" | "hiring" | "hiring-1" | "candidate" | "candidates" | "candidates-1" | "employee" | "employee-1" | "employee-2" | "management" | "management-1" | "job-search" | "job-search-2" | "job-search-3" | "resume" | "resume-1" | "resume-2" | "profile" | "profile-1" | "profiles" | "time-management" | "presentation" | "award" | "hierarchical-structure" | "conversation" | "conversation-1" | "trophy" | "puzzle" | "puzzle-1" | "work-team" | "finances" | "leadership" | "skills" | "email" | "email-1" | "analytics" | "target" | "target-1" | "strategy" | "problems" | "podium" | "podium-1" | "profits" | "calendar" | "calendar-1" | "portfolio" | "list" | "pension" | "deal" | "diploma" | "salary" | "promotion" | "project-management" | "conveyor" | "stats" | "education" | "team" | "team-1" | "folder" | "goal" | "dollar" | "pay" | "task-list" | "briefcase" | "search" | "identity" | "talking" | "interview" | "interview-1" | "agreement" | "diagram" | "diagram-1" | "badge" | "laptop" | "life-guard" | "link" | "hierarchy" | "hierarchy-1" | "hierarchy-2" | "transfer" | "account" | "brain" | "shield" | "connect" | "connect-1" | "pin" | "tie" | "diamond" | "eye" | "man" | "clock" | "user-1" | "faq" | "support" | "calculator" | "setting" | "directory" | "analyzing" | "flight" | "contract" | "orbit" | "pie-chart" | "business-proposal" | "trust" | "solution" | "continuous-improvement" | "relationships" | "analysis" | "public-health" | "social-security" | "idea" | "idea-1" | "compassion" | "infographics" | "experts" | "relationship" | "need-assessment" | "diversity" | "approach" | "timer" | "digital-transformation" | "marketplace" | "partnership" | "scenic">;
	
	/**
	 * Title field in *WhyChooseSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: AI-Powered
	 * - **API ID Path**: why_choose_slice.items[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Title Highlight field in *WhyChooseSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Talent Matching
	 * - **API ID Path**: why_choose_slice.items[].title_highlight
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title_highlight: prismic.KeyTextField;
	
	/**
	 * Description field in *WhyChooseSlice → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: why_choose_slice.items[].description
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	description: prismic.KeyTextField;
}

/**
 * Blue variation for WhyChooseSlice Slice
 *
 * - **API ID**: `blue`
 * - **Description**: Blue accent variation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type WhyChooseSliceSliceBlue = prismic.SharedSliceVariation<"blue", Simplify<WhyChooseSliceSliceBluePrimary>, Simplify<WhyChooseSliceSliceBlueItem>>;

/**
 * Slice variation for *WhyChooseSlice*
 */
type WhyChooseSliceSliceVariation = WhyChooseSliceSliceDefault | WhyChooseSliceSliceBlue

/**
 * WhyChooseSlice Shared Slice
 *
 * - **API ID**: `why_choose_slice`
 * - **Description**: Why Choose section with image, heading and cards
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type WhyChooseSliceSlice = prismic.SharedSlice<"why_choose_slice", WhyChooseSliceSliceVariation>;

declare module "@prismicio/client" {
	interface CreateClient {
		(repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
	}
	
	interface CreateWriteClient {
		(repositoryNameOrEndpoint: string, options: prismic.WriteClientConfig): prismic.WriteClient<AllDocumentTypes>;
	}
	
	interface CreateMigration {
		(): prismic.Migration<AllDocumentTypes>;
	}
	
	namespace Content {
		export type {
			BlogPostDocument,
			BlogPostDocumentData,
			BlogPostDocumentDataSlicesSlice,
			NavigationDocument,
			NavigationDocumentData,
			NavigationDocumentDataLinksItem,
			NavigationDocumentDataSubLinksItem,
			NavigationDocumentDataNestedLinksItem,
			PageDocument,
			PageDocumentData,
			PageDocumentDataSlicesSlice,
			SettingsDocument,
			SettingsDocumentData,
			AllDocumentTypes,
			AlternatingCardsGridSliceSlice,
			AlternatingCardsGridSliceSliceDefaultPrimaryCaseStudiesItem,
			AlternatingCardsGridSliceSliceDefaultPrimary,
			AlternatingCardsGridSliceSliceBluePrimaryCaseStudiesItem,
			AlternatingCardsGridSliceSliceBluePrimary,
			AlternatingCardsGridSliceSliceWhiteBackgroundPrimaryCaseStudiesItem,
			AlternatingCardsGridSliceSliceWhiteBackgroundPrimary,
			AlternatingCardsGridSliceSliceVariation,
			AlternatingCardsGridSliceSliceDefault,
			AlternatingCardsGridSliceSliceBlue,
			AlternatingCardsGridSliceSliceWhiteBackground,
			BlogBodySliceSlice,
			BlogBodySliceSliceDefaultPrimary,
			BlogBodySliceSliceQuotePrimary,
			BlogBodySliceSliceVariation,
			BlogBodySliceSliceDefault,
			BlogBodySliceSliceQuote,
			BlogListSliceSlice,
			BlogListSliceSliceDefaultPrimary,
			BlogListSliceSliceVariation,
			BlogListSliceSliceDefault,
			CardsGridSliceSlice,
			CardsGridSliceSliceDefaultPrimaryCardsItem,
			CardsGridSliceSliceDefaultPrimary,
			CardsGridSliceSliceBluePrimaryCardsItem,
			CardsGridSliceSliceBluePrimary,
			CardsGridSliceSliceVariation,
			CardsGridSliceSliceDefault,
			CardsGridSliceSliceBlue,
			ChartSliceSlice,
			ChartSliceSliceDefaultPrimary,
			ChartSliceSliceDefaultItem,
			ChartSliceSliceVariation,
			ChartSliceSliceDefault,
			ClientsSliceSlice,
			ClientsSliceSliceDefaultPrimary,
			ClientsSliceSliceDefaultItem,
			ClientsSliceSliceVariation,
			ClientsSliceSliceDefault,
			ContactSliceSlice,
			ContactSliceSliceDefaultPrimaryRoleOptionsItem,
			ContactSliceSliceDefaultPrimary,
			ContactSliceSliceDefaultItem,
			ContactSliceSliceVariation,
			ContactSliceSliceDefault,
			ContentSliceSlice,
			ContentSliceSliceDefaultPrimary,
			ContentSliceSliceVariation,
			ContentSliceSliceDefault,
			CounterSliceSlice,
			CounterSliceSliceDefaultItem,
			CounterSliceSliceAltBackgroundItem,
			CounterSliceSliceBlueItem,
			CounterSliceSliceVariation,
			CounterSliceSliceDefault,
			CounterSliceSliceAltBackground,
			CounterSliceSliceBlue,
			CtaSliceSlice,
			CtaSliceSliceDefaultPrimary,
			CtaSliceSliceGreenBgPrimary,
			CtaSliceSliceVariation,
			CtaSliceSliceDefault,
			CtaSliceSliceGreenBg,
			FaqSliceSlice,
			FaqSliceSliceDefaultPrimary,
			FaqSliceSliceDefaultItem,
			FaqSliceSliceVariation,
			FaqSliceSliceDefault,
			FeatureRowsSliceSlice,
			FeatureRowsSliceSliceDefaultPrimaryRowsItem,
			FeatureRowsSliceSliceDefaultPrimary,
			FeatureRowsSliceSliceVariation,
			FeatureRowsSliceSliceDefault,
			FeaturedBlogsSliceSlice,
			FeaturedBlogsSliceSliceDefaultPrimary,
			FeaturedBlogsSliceSliceVariation,
			FeaturedBlogsSliceSliceDefault,
			HeadingSliceSlice,
			HeadingSliceSliceDefaultPrimary,
			HeadingSliceSliceVariation,
			HeadingSliceSliceDefault,
			HeroSliceSlice,
			HeroSliceSliceDefaultPrimaryRotatingWordsItem,
			HeroSliceSliceDefaultPrimaryStatsItem,
			HeroSliceSliceDefaultPrimaryLogosItem,
			HeroSliceSliceDefaultPrimaryFeaturesItem,
			HeroSliceSliceDefaultPrimary,
			HeroSliceSliceBluePrimaryRotatingWordsItem,
			HeroSliceSliceBluePrimaryStatsItem,
			HeroSliceSliceBluePrimaryLogosItem,
			HeroSliceSliceBluePrimaryFeaturesItem,
			HeroSliceSliceBluePrimary,
			HeroSliceSliceVariation,
			HeroSliceSliceDefault,
			HeroSliceSliceBlue,
			ImageSliceSlice,
			ImageSliceSliceDefaultPrimary,
			ImageSliceSliceVariation,
			ImageSliceSliceDefault,
			NewsletterSliceSlice,
			NewsletterSliceSliceDefaultPrimary,
			NewsletterSliceSliceBluePrimary,
			NewsletterSliceSliceVariation,
			NewsletterSliceSliceDefault,
			NewsletterSliceSliceBlue,
			OurStorySliceSlice,
			OurStorySliceSliceDefaultPrimary,
			OurStorySliceSliceBluePrimary,
			OurStorySliceSliceVariation,
			OurStorySliceSliceDefault,
			OurStorySliceSliceBlue,
			ProcessSliceSlice,
			ProcessSliceSliceDefaultPrimary,
			ProcessSliceSliceDefaultItem,
			ProcessSliceSliceBluePrimary,
			ProcessSliceSliceBlueItem,
			ProcessSliceSliceVariation,
			ProcessSliceSliceDefault,
			ProcessSliceSliceBlue,
			RoiCalculatorSliceSlice,
			RoiCalculatorSliceSliceDefaultPrimary,
			RoiCalculatorSliceSliceVariation,
			RoiCalculatorSliceSliceDefault,
			ServicesSliceSlice,
			ServicesSliceSliceDefaultPrimaryItemsItem,
			ServicesSliceSliceDefaultPrimary,
			ServicesSliceSliceBluePrimaryItemsItem,
			ServicesSliceSliceBluePrimary,
			ServicesSliceSliceVariation,
			ServicesSliceSliceDefault,
			ServicesSliceSliceBlue,
			SmallHeroSliceSlice,
			SmallHeroSliceSliceDefaultPrimary,
			SmallHeroSliceSliceVariation,
			SmallHeroSliceSliceDefault,
			TeamSliceSlice,
			TeamSliceSliceDefaultPrimary,
			TeamSliceSliceDefaultItem,
			TeamSliceSliceVariation,
			TeamSliceSliceDefault,
			TestimonialsSliceSlice,
			TestimonialsSliceSliceDefaultPrimary,
			TestimonialsSliceSliceDefaultItem,
			TestimonialsSliceSliceVariation,
			TestimonialsSliceSliceDefault,
			TestsSliceSlice,
			TestsSliceSliceDefaultPrimaryCardsItem,
			TestsSliceSliceDefaultPrimary,
			TestsSliceSliceVariation,
			TestsSliceSliceDefault,
			VideoSliceSlice,
			VideoSliceSliceDefaultPrimary,
			VideoSliceSliceVariation,
			VideoSliceSliceDefault,
			WebinarFormSliceSlice,
			WebinarFormSliceSliceDefaultPrimary,
			WebinarFormSliceSliceVariation,
			WebinarFormSliceSliceDefault,
			WebinarListSliceSlice,
			WebinarListSliceSliceDefaultPrimary,
			WebinarListSliceSliceDefaultItem,
			WebinarListSliceSliceVariation,
			WebinarListSliceSliceDefault,
			WhyChooseSliceSlice,
			WhyChooseSliceSliceDefaultPrimary,
			WhyChooseSliceSliceDefaultItem,
			WhyChooseSliceSliceBluePrimary,
			WhyChooseSliceSliceBlueItem,
			WhyChooseSliceSliceVariation,
			WhyChooseSliceSliceDefault,
			WhyChooseSliceSliceBlue
		}
	}
}