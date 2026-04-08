#!/usr/bin/env python3
"""
Script para gerar relatório estruturado de discrepâncias de chaves
"""
import re
from pathlib import Path
from collections import defaultdict

def extract_keys_from_ts(file_path):
    """Extrai os nomes das chaves de um arquivo TypeScript de mensagens"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        keys = set()
        pattern = r'[\s{,]([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:'
        matches = re.finditer(pattern, content)

        for match in matches:
            key = match.group(1)
            if key not in ['pt', 'en', 'export', 'default', 'type']:
                keys.add(key)

        return sorted(keys)
    except Exception as e:
        return []

def generate_report():
    """Gera relatório estruturado"""
    base_path = Path('/home/italo/Laboratorio/sensei-dev/src/core/messages')
    en_dir = base_path / 'en'
    pt_dir = base_path / 'pt'

    en_files = sorted(en_dir.rglob('*-messages.ts'))

    discrepancies = []

    print("=" * 100)
    print("RELATÓRIO DE DISCREPÂNCIAS DE CHAVES ENTRE EN E PT")
    print("=" * 100)
    print()

    file_count = 0
    issue_count = 0

    for en_file in en_files:
        file_count += 1
        relative_path = en_file.relative_to(en_dir)
        pt_file = pt_dir / relative_path

        if not pt_file.exists():
            continue

        en_keys = set(extract_keys_from_ts(str(en_file)))
        pt_keys = set(extract_keys_from_ts(str(pt_file)))

        if not en_keys or not pt_keys:
            continue

        if en_keys != pt_keys:
            issue_count += 1
            only_in_en = sorted(en_keys - pt_keys)
            only_in_pt = sorted(pt_keys - en_keys)

            file_rel_path = str(relative_path)
            en_full_path = str(en_file.relative_to(base_path.parent))

            discrepancies.append({
                'arquivo': en_full_path,
                'only_en': only_in_en,
                'only_pt': only_in_pt,
                'en_count': len(en_keys),
                'pt_count': len(pt_keys),
            })

    # Adiciona estatísticas globais
    print(f"📊 ESTATÍSTICAS GLOBAIS")
    print(f"   Total de arquivos de mensagens: {file_count}")
    print(f"   Arquivos com discrepâncias: {issue_count}")
    print()

    # Gera relatório por arquivo
    print("=" * 100)
    print("DETALHES POR ARQUIVO")
    print("=" * 100)
    print()

    for i, item in enumerate(discrepancies, 1):
        print(f"{i}. arquivo: {item['arquivo']}")
        print(f"   mapeamentos:")

        # Mostra chaves apenas em EN
        if item['only_en']:
            print(f"      ❌ APENAS EM EN (não existem em PT):")
            for key in item['only_en']:
                print(f"         - EN.{key}")

        # Mostra chaves apenas em PT
        if item['only_pt']:
            print(f"      ❌ APENAS EM PT (não existem em EN):")
            for key in item['only_pt']:
                print(f"         - PT.{key}")

        print()

    # Salva resultado em arquivo
    output_file = Path('/home/italo/Laboratorio/sensei-dev/discrepancias_chaves.txt')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("=" * 100 + "\n")
        f.write("RELATÓRIO DE DISCREPÂNCIAS DE CHAVES ENTRE EN E PT\n")
        f.write("=" * 100 + "\n\n")

        f.write(f"📊 ESTATÍSTICAS GLOBAIS\n")
        f.write(f"   Total de arquivos de mensagens: {file_count}\n")
        f.write(f"   Arquivos com discrepâncias: {issue_count}\n\n")

        f.write("=" * 100 + "\n")
        f.write("DETALHES POR ARQUIVO\n")
        f.write("=" * 100 + "\n\n")

        for i, item in enumerate(discrepancies, 1):
            f.write(f"{i}. arquivo: {item['arquivo']}\n")
            f.write(f"   mapeamentos:\n")

            if item['only_en']:
                f.write(f"      ❌ APENAS EM EN (não existem em PT):\n")
                for key in item['only_en']:
                    f.write(f"         - EN.{key}\n")

            if item['only_pt']:
                f.write(f"      ❌ APENAS EM PT (não existem em EN):\n")
                for key in item['only_pt']:
                    f.write(f"         - PT.{key}\n")

            f.write("\n")

    print(f"✅ Relatório salvo em: {output_file}")

if __name__ == '__main__':
    generate_report()
