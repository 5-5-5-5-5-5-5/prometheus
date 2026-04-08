#!/usr/bin/env python3
"""
Script para encontrar mapeamentos de chaves entre EN e PT
"""
import re
import json
import os
from pathlib import Path
from collections import defaultdict, OrderedDict

def parse_ts_file(file_path):
    """
    Extrai as chaves e valores de um arquivo TypeScript de mensagens
    Tenta preservar a ordem e estrutura
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Remove comentários
        content = re.sub(r'//.*?$', '', content, flags=re.MULTILINE)
        content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)

        # Procura pelo objeto export (pt ou en)
        # Padrão esperado: export const pt = { ... }
        export_match = re.search(r'export\s+const\s+(?:pt|en)\s*=\s*({[^}]+(?:{[^}]*}[^}]*)*})', content, re.DOTALL)

        if not export_match:
            # Tenta com mais flexibilidade
            export_match = re.search(r'const\s+(?:messages|pt|en)\s*=\s*({[^}]*(?:{[^}]*}[^}]*)*})', content, re.DOTALL)

        if not export_match:
            return {}

        obj_str = export_match.group(1)

        # Extrai as chaves e seus valores
        keys = {}
        pattern = r'([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*(?:\'[^\']*\'|"[^"]*"|`[^`]*`|[^,}]+)'

        for match in re.finditer(pattern, obj_str):
            key = match.group(1)
            if key not in ['export', 'const', 'pt', 'en', 'default']:
                keys[key] = True

        return keys
    except Exception as e:
        print(f"❌ Erro ao ler {file_path}: {e}", file=open('/dev/stderr', 'a'))
        return {}

def find_key_mappings():
    """
    Encontra mapeamentos de chaves entre EN e PT
    """
    base_path = Path('/home/italo/Laboratorio/sensei-dev/src/core/messages')
    en_dir = base_path / 'en'
    pt_dir = base_path / 'pt'

    en_files = sorted(en_dir.rglob('*-messages.ts'))

    print("🔍 Analisando mapeamentos de chaves EN → PT...\n")

    mappings = []
    total_files = 0
    files_with_mappings = 0

    for en_file in en_files:
        total_files += 1
        relative_path = en_file.relative_to(en_dir)
        pt_file = pt_dir / relative_path

        if not pt_file.exists():
            continue

        en_keys = parse_ts_file(str(en_file))
        pt_keys = parse_ts_file(str(pt_file))

        if not en_keys or not pt_keys:
            continue

        # Encontra chaves que aparecem em ambos mas com nomes diferentes
        only_in_en = set(en_keys.keys()) - set(pt_keys.keys())
        only_in_pt = set(pt_keys.keys()) - set(pt_keys.keys())

        if only_in_en and only_in_pt and len(only_in_en) == len(only_in_pt):
            # Possível mapeamento 1:1
            en_sorted = sorted(only_in_en)
            pt_sorted = sorted(only_in_pt)

            if en_sorted != pt_sorted:
                files_with_mappings += 1
                file_rel_path = str(relative_path)

                mappings.append({
                    'arquivo': f'src/core/messages/en/{file_rel_path}',
                    'en_keys': en_sorted,
                    'pt_keys': pt_sorted,
                    'mapeamentos': list(zip(en_sorted, pt_sorted))
                })

    print(f"📊 Estatísticas:")
    print(f"   Total de arquivos analisados: {total_files}")
    print(f"   Arquivos com possíveis mapeamentos: {files_with_mappings}\n")

    if mappings:
        print("=" * 80)
        print("MAPEAMENTOS DE CHAVES ENCONTRADOS (EN → PT)")
        print("=" * 80 + "\n")

        for i, item in enumerate(mappings, 1):
            print(f"{i}. arquivo: {item['arquivo']}")
            print(f"   mapeamentos:")
            for en_key, pt_key in item['mapeamentos']:
                print(f"      EN: {en_key} → PT: {pt_key}")
            print()
    else:
        print("ℹ️  Nenhum mapeamento simples 1:1 encontrado.")
        print("\nO análise anterior mostrou que EN e PT têm conjuntos diferentes de chaves,")
        print("indicando que os arquivos foram traduzidos e não apenas renomeados.")

if __name__ == '__main__':
    find_key_mappings()
