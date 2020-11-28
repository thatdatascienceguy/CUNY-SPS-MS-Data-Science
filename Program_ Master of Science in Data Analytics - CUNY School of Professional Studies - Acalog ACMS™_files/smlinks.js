SocialMediaLinks = {
    links: [ ],
    identifier: 0,
    addLink: function (link)
    {
        link.identifier = SocialMediaLinks.identifier;
        link.socialMediaActivated = true;
        SocialMediaLinks.links[SocialMediaLinks.identifier] = link;
        SocialMediaLinks.identifier += 1;
    },
    getLink: function (id)
    {
        return SocialMediaLinks.links[id];
    }
}
function socialMediaActivate() {
    // Get all social media links
    var links = $$('.acalog-social-media-links a');

    // If we find some, iterate
    if (links.length > 0) {
        links.each(
            function (link)    {
                // Check if it was already activated, and skip
                if (link.socialMediaActivated == true) {
                    return;
                }
				
				// Record the link
                SocialMediaLinks.addLink(link);

                // Add a click observer
                Event.observe($(link),'click',
					function (event) {
                        try {
                            // Get the link
                            var link = Event.element(event);
                            // It may have activated a descendant, get the parent <a>
                            if (link.tagName.toLowerCase() != 'a') {
                                link = link.up('a');
                            }

                            // Get the icon image
                            var img = link.down('img');
                            // Save the original source
                            img.originalSrc = img.src;
                            img.src = '/loading.gif';
                            link.icon = img;

                            new Ajax.Request('/getShortUrl.php', {
                                parameters: {
                                    id: link.identifier,
                                    link: link.href
                                },
                                onSuccess: function (response)
                                {
                                    // Set the icon back
                                    var json = response.responseText.evalJSON();
                                    var link = SocialMediaLinks.getLink(json.id);
                                    link.icon.src = link.icon.originalSrc;

                                    acalogPopup(json.link, '_blank', 700, 450, 'yes');
                                }
                            });
                        } catch (e) {
                            var b = true;
                        }
                        Event.stop(event);
                    }
                );
            }
        );
    }
}

socialMediaActivate();


