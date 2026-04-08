#!/usr/bin/env python3
"""
Análise completa de discrepâncias para gerar relatório
"""
import re
import json
from pathlib import Path
from typing import Dict, Set

def extract_keys(file_path: str) -> Set[str]:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        content = re.sub(r'//.*?$', '', content, flags=re.MULTILINE)
        content = re.sub(r'/\*[\s\S]*?\*/', '', content)

        keys = set()
        pattern = r'[,{\s]\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\:'

        for match in re.finditer(pattern, content):
            key = match.group(1)
            keywords = {'import', 'export', 'from', 'as', 'type', 'interface', 'const',
                       'function', 'class', 'default', 'enum', 'namespace', 'declare',
                       'extends', 'implements', 'new', 'return', 'if', 'else', 'for',
                       'while', 'switch', 'case', 'break', 'continue', 'throw', 'try',
                       'catch', 'finally', 'with', 'delete', 'typeof', 'instanceof',
                       'do', 'await', 'async', 'yield', 'let', 'var', 'null', 'true',
                       'false', 'this', 'super', 'static', 'public', 'private', 'protected',
                       'readonly', 'abstract', 'module'}

            if key not in keywords and not key[0].isupper():
                keys.add(key)

        return keys
    except:
        return set()

def main():
    base_path = Path('/home/italo/Laboratorio/sensei-dev/src/core/messages')
    en_dir = base_path / 'en'
    pt_dir = base_path / 'pt'

    en_files = sorted(en_dir.rglob('*-messages.ts'))

    with_mappings = []
    without_mappings = []
    without_discrepancies = []

    for en_file in en_files:
        relative_path = en_file.relative_to(en_dir)
        pt_file = pt_dir / relative_path

        if not pt_file.exists():
            continue

        en_keys = extract_keys(str(en_file))
        pt_keys = extract_keys(str(pt_file))

        if not en_keys or not pt_keys:
            continue

        only_en = en_keys - pt_keys
        only_pt = pt_keys - en_keys

        if not only_en and not only_pt:
            without_discrepancies.append(str(relative_path))
        elif only_en or only_pt:
            with_discrepancies = {
                'file': str(relative_path),
                'en_only': len(only_en),
                'pt_only': len(only_pt),
                'en_keys': sorted(only_en),
                'pt_keys': sorted(only_pt)
            }

            # Check if already in JSON
            with open('/home/italo/Laboratorio/sensei-dev/key_mappings_complete.json', 'r') as f:
                json_data = json.load(f)

            files_in_json = [item['arquivo'].split('/')[-1] for item in json_data]
            if en_file.name in files_in_json:
                with_mappings.append(with_discrepancies)
            else:
                without_mappings.append(with_discrepancies)

    print(f"📊 RESUMO DA ANÁLISE")
    print(f"=" * 80)
    print(f"✅ Arquivos COM mapeamentos encontrados: {len(with_mappings)}")
    print(f"❌ Arquivos COM discrepâncias MAS SEM mapeamentos viáveis: {len(without_mappings)}")
    print(f"⚪ Arquivos SEM discrepâncias: {len(without_discrepancies)}")
    print(f"📈 TOTAL COM DISCREPÂNCIAS: {len(with_mappings) + len(without_mappings)}")
    print()

    print(f"📋 ARQUIVOS SEM MAPEAMENTOS VIÁVEIS ({len(without_mappings)}):")
    for item in without_mappings:
        print(f"\n   {item['file']}")
        print(f"      EN only ({item['en_only']}): {', '.join(item['en_keys'][:3])}")
        if len(item['en_keys']) > 3:
            print(f"                 ... e mais {len(item['en_keys']) - 3}")
        print(f"      PT only ({item['pt_only']}): {', '.join(item['pt_keys'][:3])}")
        if len(item['pt_keys']) > 3:
            print(f"                 ... e mais {len(item['pt_keys']) - 3}")

if __name__ == '__main__':
    main()
