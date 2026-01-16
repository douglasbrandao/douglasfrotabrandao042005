# Instruções para o GitHub Copilot

## Convenção de Commits

Siga rigorosamente a convenção de Conventional Commits com as seguintes adaptações:

### Regras:
- **Idioma**: Todos os commits devem ser escritos em português
- **Sem scope**: Não utilize a estrutura de scope `type(scope):`
- **Limite de caracteres**: Máximo de 50 caracteres por mensagem de commit
- **Estrutura simples**: Apenas o título do commit, sem body nem footer

### Formato:
```
<tipo>: <descrição>
```

### Tipos permitidos:
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Alterações em documentação
- **style**: Formatação, ponto e vírgula faltando, etc (sem mudança de código)
- **refactor**: Refatoração de código sem alterar funcionalidade
- **perf**: Melhoria de performance
- **test**: Adição ou correção de testes
- **chore**: Atualização de tarefas de build, configurações, etc

### Exemplos:

✅ **Correto:**
```
feat: adiciona cadastro de pets
fix: corrige validação de data de nascimento
docs: atualiza README com instruções de instalação
style: ajusta indentação no componente de lista
refactor: simplifica lógica de autenticação
perf: otimiza consulta de pets no banco
test: adiciona testes para serviço de agendamento
chore: atualiza dependências do projeto
```

❌ **Incorreto:**
```
feat(pets): adiciona cadastro de pets  // Não usar scope
feat: Adiciona cadastro de pets  // Primeira letra minúscula
feat: adiciona funcionalidade completa de cadastro de pets com validação  // Mais de 50 caracteres
Add pet registration  // Não está em português
```

### Dicas:
- Use verbos no imperativo (adiciona, corrige, atualiza)
- Seja conciso e objetivo
- Primeira letra após o tipo em minúscula
- Não use ponto final
