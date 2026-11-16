# Robô de publicação agendada do site da Casa Circe.
# Roda no GitHub todo dia às 8h de Brasília (.github/workflows/publicar-artigos.yml).
# Para cada artigo do agenda.json cuja data já chegou e que ainda não está no ar:
#   1. copia a página de _agenda para a raiz do site;
#   2. coloca o cartão dele no topo da lista da página Conteúdo;
#   3. inclui o endereço no sitemap.xml e no llms.txt.
# Depois o GitHub salva a mudança e o Netlify publica sozinho.
import datetime, json, os, shutil
RAIZ = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
AG = os.path.join(RAIZ, "_agenda")
BASE = "https://casacirce.com.br/"
hoje = (datetime.datetime.utcnow() - datetime.timedelta(hours=3)).date().isoformat()

agenda = json.load(open(os.path.join(AG, "agenda.json"), encoding="utf-8"))
publicados = []
for item in sorted(agenda, key=lambda x: x["data"]):
    destino = os.path.join(RAIZ, item["slug"] + ".html")
    if item["data"] > hoje or os.path.exists(destino):
        continue
    shutil.copyfile(os.path.join(AG, item["slug"] + ".html"), destino)

    p = os.path.join(RAIZ, "conteudo.html"); s = open(p, encoding="utf-8").read()
    marca = '<a class="g ln nd" href="'
    if f'href="{item["slug"]}.html"' not in s:
        s = s.replace(marca, item["cartao"] + marca, 1); open(p, "w", encoding="utf-8", newline="\n").write(s)

    p = os.path.join(RAIZ, "sitemap.xml"); s = open(p, encoding="utf-8").read()
    if BASE + item["slug"] not in s:
        s = s.replace("</urlset>", f"  <url>\n    <loc>{BASE}{item['slug']}</loc>\n    <lastmod>{item['data']}</lastmod>\n  </url>\n</urlset>")
        open(p, "w", encoding="utf-8", newline="\n").write(s)

    p = os.path.join(RAIZ, "llms.txt")
    if os.path.exists(p):
        s = open(p, encoding="utf-8").read()
        if BASE + item["slug"] not in s:
            s = s.rstrip("\n") + f"\n- [{item['titulo']}]({BASE}{item['slug']}): {item['resumo']}\n"
            open(p, "w", encoding="utf-8", newline="\n").write(s)
    publicados.append(item["slug"])

print("Publicados hoje:", ", ".join(publicados) if publicados else "nenhum")
