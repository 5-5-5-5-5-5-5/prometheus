#!/usr/bin/env python3
"""
Script para gerar JSON estruturado com mapeamentos de chaves EN → PT
Versão robusta com análise profunda de chaves
"""
import re
import json
from pathlib import Path
from typing import Dict, List, Set, Tuple

def extract_keys_from_ts(file_path: str) -> Set[str]:
    """
    Extrai TODAS as chaves de um arquivo TypeScript de mensagens
    Usa uma abordagem mais cuidadosa para encontrar propriedades de objetos
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Remove comentários
        content = re.sub(r'//.*?$', '', content, flags=re.MULTILINE)
        content = re.sub(r'/\*[\s\S]*?\*/', '', content)

        keys = set()

        # Procura por padrões de chaves em objetos
        # Padrão: "chave:" onde chave é um identificador válido
        # Pode ser após { ou , ou espaço/nova linha
        pattern = r'[,{\s]\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\:'

        for match in re.finditer(pattern, content):
            key = match.group(1)
            # Filtra keywords TypeScript/JavaScript
            keywords = {'import', 'export', 'from', 'as', 'type', 'interface', 'const',
                       'function', 'class', 'default', 'enum', 'namespace', 'declare',
                       'extends', 'implements', 'new', 'return', 'if', 'else', 'for',
                       'while', 'switch', 'case', 'break', 'continue', 'throw', 'try',
                       'catch', 'finally', 'with', 'delete', 'typeof', 'instanceof',
                       'do', 'await', 'async', 'yield', 'let', 'var', 'null', 'true',
                       'false', 'this', 'super', 'static', 'public', 'private', 'protected',
                       'readonly', 'abstract', 'module'}

            if key not in keywords and not key[0].isupper():  # Filtra constructores
                keys.add(key)

        return keys

    except Exception as e:
        print(f"❌ Erro ao ler {file_path}: {e}")
        return set()

def identify_mappings(en_keys: Set[str], pt_keys: Set[str]) -> List[Dict[str, str]]:
    """
    Identifica mapeamentos entre chaves EN e PT
    Retorna lista de {"de": en_key, "para": pt_key} para chaves diferentes
    """
    mappings = []

    # Chaves que existem em EN mas não em PT
    only_in_en = en_keys - pt_keys

    # Chaves que existem em PT mas não em EN
    only_in_pt = pt_keys - en_keys

    # Se tem o mesmo número de chaves diferentes, pode haver mapeamento
    if only_in_en and only_in_pt and len(only_in_en) == len(only_in_pt):
        # Ordena alfabeticamente para tentar alinhamento
        en_sorted = sorted(only_in_en)
        pt_sorted = sorted(only_in_pt)

        # Cria mapeamentos 1:1
        for en_key, pt_key in zip(en_sorted, pt_sorted):
            mappings.append({
                "de": en_key,
                "para": pt_key
            })

    return mappings

def analyze_all_messages() -> List[Dict]:
    """
    Analisa todos os arquivos de mensagens EN e PT
    Retorna lista com mapeamentos de cada arquivo que tem discrepâncias
    """
    base_path = Path('/home/italo/Laboratorio/sensei-dev/src/core/messages')
    en_dir = base_path / 'en'
    pt_dir = base_path / 'pt'

    # Encontra todos os arquivos EN
    en_files = sorted(en_dir.rglob('*-messages.ts'))

    result = []
    files_with_mappings = 0

    print(f"🔍 Analisando {len(en_files)} arquivos de mensagens...\n")

    for en_file in en_files:
        relative_path = en_file.relative_to(en_dir)
        pt_file = pt_dir / relative_path

        if not pt_file.exists():
            print(f"⚠️  {str(relative_path)}: arquivo PT não encontrado")
            continue

        # Extrai chaves
        en_keys = extract_keys_from_ts(str(en_file))
        pt_keys = extract_keys_from_ts(str(pt_file))

        if not en_keys or not pt_keys:
            continue

        # Identifica mapeamentos
        mapeamentos = identify_mappings(en_keys, pt_keys)

        if mapeamentos:
            files_with_mappings += 1
            result.append({
                "arquivo": f"src/core/messages/en/{str(relative_path)}",
                "mapeamentos": mapeamentos
            })
            print(f"✅ {str(relative_path)}: {len(mapeamentos)} mapeamento(s)")
        else:
            # Verifica se há diferenças mesmo que não sejam 1:1
            only_en = en_keys - pt_keys
            only_pt = pt_keys - en_keys
            if only_en or only_pt:
                print(f"⚠️  {str(relative_path)}: {len(only_en)} em EN, {len(only_pt)} em PT (sem mapeamento 1:1)")

    print(f"\n📊 Total de arquivos analisados: {len(en_files)}")
    print(f"✅ Arquivos com mapeamentos encontrados: {files_with_mappings}\n")

    return result

def save_json_result(result: List[Dict], output_file: str):
    """Salva o resultado em JSON"""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print(f"✅ JSON salvo em: {output_file}")
    print(f"   Total de arquivos com mapeamentos: {len(result)}")

    # Mostra um preview do JSON
    if result:
        print(f"\n📋 Preview dos primeiros mapeamentos:")
        for item in result[:3]:
            print(f"\n   📁 {item['arquivo']}")
            for mapa in item['mapeamentos'][:2]:
                print(f"      {mapa['de']} → {mapa['para']}")
            if len(item['mapeamentos']) > 2:
                print(f"      ... e mais {len(item['mapeamentos']) - 2}")

def main():
    """Função principal"""
    result = analyze_all_messages()

    output_file = '/home/italo/Laboratorio/sensei-dev/key_mappings.json'
    save_json_result(result, output_file)

if __name__ == '__main__':
    main()
