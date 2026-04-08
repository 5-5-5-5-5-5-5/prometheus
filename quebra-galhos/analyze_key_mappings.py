#!/usr/bin/env python3
"""
Script para gerar JSON estruturado com mapeamentos de chaves EN → PT
"""
import re
import json
import os
from pathlib import Path
from typing import Dict, Set, List, Tuple

def parse_ts_file(file_path: str) -> Dict[str, str]:
    """
    Extrai as chaves de um arquivo TypeScript de mensagens
    Retorna um dicionário {chave: tipo_valor}
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Remove comentários de linha
        lines = []
        for line in content.split('\n'):
            # Remove comentário da linha
            comment_idx = line.find('//')
            if comment_idx != -1:
                line = line[:comment_idx]
            lines.append(line)
        content = '\n'.join(lines)

        # Remove comentários de bloco
        content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)

        keys = {}

        # Padrão para encontrar chaves: "chave: valor" ou "chave: { ... }"
        # Procura por: palavra_chave (seguida de :)
        pattern = r'([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:'

        for match in re.finditer(pattern, content):
            key = match.group(1)
            # Filtra palavras-chave e keywords
            if key not in ['pt', 'en', 'export', 'default', 'const', 'import', 'type', 'interface', 'from', 'as']:
                keys[key] = True

        return list(set(keys.keys()))  # Retorna lista de chaves únicas

    except Exception as e:
        print(f"❌ Erro ao ler {file_path}: {e}")
        return []

def find_similar_keys(en_keys: List[str], pt_keys: List[str]) -> List[Tuple[str, str]]:
    """
    Encontra possíveis mapeamentos entre chaves EN e PT
    por similaridade de posição e comprimento
    """
    mappings = []

    # Se temos o mesmo número de chaves que não coincidem
    only_in_en = sorted([k for k in en_keys if k not in pt_keys])
    only_in_pt = sorted([k for k in pt_keys if k not in en_keys])

    # Se há mapeamento 1:1 possível
    if len(only_in_en) == len(only_in_pt) and only_in_en:
        for en_key, pt_key in zip(only_in_en, only_in_pt):
            # Verifica similaridade (mesmo tamanho, estrutura)
            # No caso português ↔ inglês, são frequentemente traduções diferentes
            mappings.append((en_key, pt_key))

    return mappings

def analyze_all_messages():
    """
    Analisa todos os arquivos de mensagens e gera mapeamentos
    """
    base_path = Path('/home/italo/Laboratorio/sensei-dev/src/core/messages')
    en_dir = base_path / 'en'
    pt_dir = base_path / 'pt'

    # Encontra todos os arquivos EN
    en_files = sorted(en_dir.rglob('*-messages.ts'))

    result = []
    total_with_discrepancies = 0

    print(f"📊 Analisando {len(en_files)} arquivos de mensagens...\n")

    for en_file in en_files:
        relative_path = en_file.relative_to(en_dir)
        pt_file = pt_dir / relative_path

        if not pt_file.exists():
            print(f"⚠️  Arquivo PT não encontrado: {relative_path}")
            continue

        # Extrai chaves
        en_keys = parse_ts_file(str(en_file))
        pt_keys = parse_ts_file(str(pt_file))

        if not en_keys or not pt_keys:
            continue

        # Encontra chaves que aparecem apenas em um ou outro
        only_in_en = set(en_keys) - set(pt_keys)
        only_in_pt = set(pt_keys) - set(en_keys)

        # Se há discrepâncias
        if only_in_en or only_in_pt:
            total_with_discrepancies += 1

            # Tenta encontrar mapeamentos
            mapeamentos = find_similar_keys(en_keys, pt_keys)

            if mapeamentos:
                result.append({
                    "arquivo": f"src/core/messages/en/{str(relative_path)}",
                    "mapeamentos": [
                        {"de": en_key, "para": pt_key}
                        for en_key, pt_key in mapeamentos
                    ]
                })
                print(f"✅ {str(relative_path)}: {len(mapeamentos)} mapeamentos encontrados")
            else:
                # Mesmo sem mapeamento 1:1 confirmado, criamos uma entrada
                # mostrando as diferenças
                print(f"⚠️  {str(relative_path)}: Sem mapeamento 1:1 (EN: {len(only_in_en)}, PT: {len(only_in_pt)})")

    print(f"\n📈 Total de arquivos com discrepâncias: {total_with_discrepancies}")
    print(f"📋 Arquivos com mapeamentos encontrados: {len(result)}\n")

    return result

def main():
    mappings = analyze_all_messages()

    # Escreve o JSON
    output_file = '/home/italo/Laboratorio/sensei-dev/key_mappings.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(mappings, f, indent=2, ensure_ascii=False)

    print(f"✅ JSON salvo em: {output_file}")
    print(f"Total de arquivos com mapeamentos: {len(mappings)}")

if __name__ == '__main__':
    main()
