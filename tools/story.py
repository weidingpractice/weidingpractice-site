"""Render today's attention as a 1080x1920 Story image: story/today.png.
Usage: python tools/story.py [YYYY-MM-DD]   (default: today in London)"""
import sys, os, datetime, zoneinfo
from playwright.sync_api import sync_playwright
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
date = sys.argv[1] if len(sys.argv) > 1 else datetime.datetime.now(zoneinfo.ZoneInfo('Europe/London')).strftime('%Y-%m-%d')
os.makedirs(os.path.join(root, 'story'), exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 540, 'height': 960}, device_scale_factor=2)
    pg.add_init_script("try{sessionStorage.setItem('forest-lang','en')}catch(e){}")
    pg.goto(f"file://{root}/index.html?story&date={date}")
    pg.wait_for_timeout(5000)
    pg.screenshot(path=os.path.join(root, 'story', 'today.png'))
    b.close()
print('story/today.png for', date)
