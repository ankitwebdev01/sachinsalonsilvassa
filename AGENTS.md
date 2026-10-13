<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep public layouts intrinsically responsive; contain deliberate sliders locally instead of clipping page overflow globally, so phone content remains fully visible.

- Store owner-uploaded website media in the private salon-media bucket; the public media route serves only exact references saved in site_content so unpublished uploads stay private.
- Keep editable website settings and repeatable content in site_content; operational appointments and expenses use separate owner-only tables so customer details never enter public content.
- Use the validated appointment-request database function for public submissions; never grant anonymous reads of customer records.
