#!/usr/bin/env python3
"""
Script para comparar nomes de chaves entre mensagens em EN e PT
"""
import re
import os
from pathlib import Path
from collections import defaultdict

def extract_keys_from_ts(file_path):
    """Extrai os nomes das chaves de um arquivo TypeScript de mensagens"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Procura por padrões como: chaveNome: 'valor' ou chaveNome: { ... }
        # Usamos regex para encontrar identificadores que são chaves
        keys = set()

        # Procura por padrões como "chave:" (início de linha ou após {, ou ,)
        pattern = r'[\s{,]([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:'
        matches = re.finditer(pattern, content)

        for match in matches:
            key = match.group(1)
            # Filtra chaves comuns que não são parte do mapeamento principal
            if key not in ['pt', 'en', 'export', 'default', 'type']:
                keys.add(key)

        return sorted(keys)
    except Exception as e:
        print(f"Erro ao ler {file_path}: {e}")
        return []

def get_relative_path(file_path):
    """Retorna o caminho relativo a partir de src/core/messages"""
    parts = file_path.split('/')
    idx = parts.index('messages')
    return '/'.join(parts[idx:])

def compare_files():
    """Compara todos os arquivos EN com PT"""
    base_path = Path('/home/italo/Laboratorio/sensei-dev/src/core/messages')

    en_dir = base_path / 'en'
    pt_dir = base_path / 'pt'

    # Encontra todos os arquivos EN
    en_files = sorted(en_dir.rglob('*-messages.ts'))

    discrepancies = defaultdict(list)
    total_files = 0
    files_with_issues = 0

    print("🔍 Analisando arquivos de mensagens...\n")

    for en_file in en_files:
        total_files += 1
        # Encontra o arquivo correspondente em PT
        relative_path = en_file.relative_to(en_dir)
        pt_file = pt_dir / relative_path

        if not pt_file.exists():
            print(f"⚠️  Arquivo PT não encontrado para: {relative_path}")
            continue

        # Extrai chaves de ambos os arquivos
        en_keys = set(extract_keys_from_ts(str(en_file)))
        pt_keys = set(extract_keys_from_ts(str(pt_file)))

        if not en_keys or not pt_keys:
            continue

        # Verifica se as chaves são diferentes
        if en_keys != pt_keys:
            files_with_issues += 1
            # Encontra as diferenças
            only_in_en = en_keys - pt_keys
            only_in_pt = pt_keys - en_keys

            file_rel_path = str(relative_path)

            if only_in_en or only_in_pt:
                discrepancies[file_rel_path] = {
                    'en_file': str(en_file.relative_to(Path('/home/italo/Laboratorio/sensei-dev'))),
                    'only_en': sorted(only_in_en),
                    'only_pt': sorted(only_in_pt),
                }

    # Printa resultados
    print(f"📊 Estatísticas:")
    print(f"   Total de arquivos analisados: {total_files}")
    print(f"   Arquivos com discrepâncias: {files_with_issues}\n")

    if discrepancies:
        print("=" * 80)
        print("ARQUIVOS COM DISCREPÂNCIAS DE CHAVES")
        print("=" * 80 + "\n")

        for i, (rel_path, info) in enumerate(sorted(discrepancies.items()), 1):
            print(f"{i}. arquivo: {info['en_file']}")

            if info['only_en']:
                print(f"   ❌ Chaves APENAS em EN (faltam em PT):")
                for key in info['only_en']:
                    print(f"      - {key}")

            if info['only_pt']:
                print(f"   ❌ Chaves APENAS em PT (faltam em EN):")
                for key in info['only_pt']:
                    print(f"      - {key}")

            print()
    else:
        print("✅ Nenhuma discrepância encontrada! Todos os arquivos têm as mesmas chaves.")

if __name__ == '__main__':
    compare_files()
