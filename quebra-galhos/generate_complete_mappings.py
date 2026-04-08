#!/usr/bin/env python3
"""
Script avançado para gerar JSON com TODOS os mapeamentos de chaves
Versão que também analisa casos com discrepâncias não-1:1
"""
import re
import json
from pathlib import Path
from typing import Dict, List, Set, Tuple
from difflib import SequenceMatcher

def extract_keys_from_ts(file_path: str) -> Set[str]:
    """Extrai TODAS as chaves de um arquivo TypeScript"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Remove comentários
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
    except Exception as e:
        print(f"❌ Erro ao ler {file_path}: {e}")
        return set()

def similarity_ratio(a: str, b: str) -> float:
    """Calcula similaridade entre duas strings (0-1)"""
    return SequenceMatcher(None, a, b).ratio()

def find_best_mapping(en_key: str, pt_candidates: List[str]) -> Tuple[str, float]:
    """Encontra a melhor correspondência de uma chave EN em PT"""
    if not pt_candidates:
        return None, 0

    scores = [(candidate, similarity_ratio(en_key, candidate)) for candidate in pt_candidates]
    best = max(scores, key=lambda x: x[1])
    return best

def identify_all_mappings(en_keys: Set[str], pt_keys: Set[str]) -> List[Dict[str, str]]:
    """
    Identifica TODOS os mapeamentos possíveis, mesmo com discrepâncias
    Usa análise de similaridade para sugerir mapeamentos
    """
    mappings = []

    only_in_en = en_keys - pt_keys
    only_in_pt = pt_keys - en_keys
    common = en_keys & pt_keys

    # Se há mapeamento 1:1 perfeito
    if only_in_en and only_in_pt and len(only_in_en) == len(only_in_pt):
        en_sorted = sorted(only_in_en)
        pt_sorted = sorted(only_in_pt)

        for en_key, pt_key in zip(en_sorted, pt_sorted):
            mappings.append({
                "de": en_key,
                "para": pt_key
            })
    # Se há discrepâncias, tenta usar similaridade
    elif only_in_en or only_in_pt:
        # Processa cada chave EN que não está em PT
        pt_candidates = list(only_in_pt)
        for en_key in sorted(only_in_en):
            best_match, score = find_best_mapping(en_key, pt_candidates)
            if best_match and score > 0.5:  # Threshold de similaridade
                mappings.append({
                    "de": en_key,
                    "para": best_match
                })
                pt_candidates.remove(best_match)

    return mappings

def analyze_all_messages() -> List[Dict]:
    """Analisa todos os 56 arquivos"""
    base_path = Path('/home/italo/Laboratorio/sensei-dev/src/core/messages')
    en_dir = base_path / 'en'
    pt_dir = base_path / 'pt'

    en_files = sorted(en_dir.rglob('*-messages.ts'))
    result = []

    print(f"🔍 Analisando {len(en_files)} arquivos com busca por TODOS os mapeamentos...\n")

    for en_file in en_files:
        relative_path = en_file.relative_to(en_dir)
        pt_file = pt_dir / relative_path

        if not pt_file.exists():
            continue

        en_keys = extract_keys_from_ts(str(en_file))
        pt_keys = extract_keys_from_ts(str(pt_file))

        if not en_keys or not pt_keys:
            continue

        mapeamentos = identify_all_mappings(en_keys, pt_keys)

        if mapeamentos:
            result.append({
                "arquivo": f"src/core/messages/en/{str(relative_path)}",
                "mapeamentos": mapeamentos
            })
            print(f"✅ {str(relative_path)}: {len(mapeamentos)} mapeamento(s)")
        else:
            only_en = en_keys - pt_keys
            only_pt = pt_keys - en_keys
            if only_en or only_pt:
                print(f"⏭️  {str(relative_path)}: sem mapeamentos (EN: {len(only_en)}, PT: {len(only_pt)})")

    print(f"\n📊 Total de arquivos com mapeamentos: {len(result)}\n")
    return result

def save_json_result(result: List[Dict], output_file: str):
    """Salva resultado em JSON"""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"✅ JSON salvo em: {output_file}")
    print(f"   Total de arquivos: {len(result)}")

    total_mappings = sum(len(item["mapeamentos"]) for item in result)
    print(f"   Total de mapeamentos: {total_mappings}\n")

def main():
    result = analyze_all_messages()
    save_json_result(result, '/home/italo/Laboratorio/sensei-dev/key_mappings_complete.json')

if __name__ == '__main__':
    main()
