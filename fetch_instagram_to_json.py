import json, os, glob
posts = []
for path in sorted(glob.glob('temp_instagram/*.json')):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        shortcode = data.get('shortcode')
        # find jpg with same name
        jpg = None
        for ext in ('.jpg', '.jpeg', '.png'):
            candidate = f'temp_instagram/{shortcode}{ext}'
            if os.path.exists(candidate):
                jpg = candidate
                break
        if jpg:
            # move to data folder and use relative path
            dst = os.path.join('data', os.path.basename(jpg))
            os.replace(jpg, dst)
            posts.append({
                'id': shortcode,
                'image': dst.replace('\\', '/'),
                'link': f'https://www.instagram.com/p/{shortcode}/',
                'caption': data.get('edge_media_to_caption', {}).get('edges', [{}])[0].get('node', {}).get('text', '')
            })
    except Exception as e:
        print('skip', path, e)
with open('data/instagram.json', 'w', encoding='utf-8') as f:
    json.dump({'items': posts}, f, ensure_ascii=False, indent=2)
