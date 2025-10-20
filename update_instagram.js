const Instagram = require('instagram-web-api');
const fs = require('fs');

const client = new Instagram({ username: 'dummy', password: 'dummy' }); // No login needed for public profiles

(async () => {
  try {
    const profile = await client.getPhotosByUsername({ username: 'lavanderia_angela_', first: 3 });
    const items = profile.user.edge_owner_to_timeline_media.edges.slice(0, 3).map(edge => ({
      id: edge.node.id,
      image: edge.node.display_url,
      permalink: `https://www.instagram.com/p/${edge.node.shortcode}/`,
      caption: edge.node.edge_media_to_caption.edges[0]?.node.text || ''
    }));
    
    fs.writeFileSync('data/instagram.json', JSON.stringify({ items }, null, 2));
    console.log('Instagram feed updated successfully!');
  } catch (error) {
    console.error('Error fetching Instagram:', error.message);
  }
})();