import instaloader
import json
import os

L = instaloader.Instaloader()
profile = instaloader.Profile.from_username(L.context, 'lavanderia_angela_')

items = []
for post in profile.get_posts():
    if len(items) >= 3:
        break
    items.append({
        'id': post.shortcode,
        'image': f'https://www.instagram.com/p/{post.shortcode}/media/?size=l',
        'permalink': f'https://www.instagram.com/p/{post.shortcode}/',
        'caption': post.caption or ''
    })

with open('data/instagram.json', 'w') as f:
    json.dump({'items': items}, f, indent=2)

print("Instagram feed updated!")