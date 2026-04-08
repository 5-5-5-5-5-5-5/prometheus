#!/usr/bin/env python3
import json
import os

# Caminho para o arquivo de mapeamentos
mappings_file = '/home/italo/Laboratorio/sensei-dev/key_mappings_complete.json'

# Carregar os mapeamentos
with open(mappings_file, 'r', encoding='utf-8') as f:
    mappings = json.load(f)

# Imprimir o cabeçalho do bash script
print('#!/bin/bash')
print('cd /home/italo/Laboratorio/sensei-dev')
print()

# Agrupar por arquivo
for item in mappings:
    arquivo = item['arquivo']
    mapeamentos = item['mapeamentos']
    if mapeamentos:
        print(f'# {arquivo}')
        for mapping in mapeamentos:
            de = mapping['de']
            para = mapping['para']
            print(f"sed -i 's/^  {de}:/  {para}:/g' {arquivo}")
        print("")</content>
<parameter name="filePath">/home/italo/Laboratorio/sensei-dev/generate_sed_commands.py