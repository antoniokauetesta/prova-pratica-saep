# Entregáveis de modelagem

## Diagrama entidade-relacionamento

```mermaid
erDiagram
    USUARIOS ||--o{ TAREFAS : cadastra
    USUARIOS {
        INT id PK
        VARCHAR nome
        VARCHAR email UK
    }
    TAREFAS {
        INT id PK
        INT usuario_id FK
        VARCHAR descricao
        VARCHAR setor
        ENUM prioridade
        DATE data_cadastro
        ENUM status
    }
```

## Caso de uso: gerenciamento de tarefas

```mermaid
flowchart LR
    Usuario[Usuário]
    Sistema((Sistema Fluxo))
    Usuario -->|cadastrar usuário| Sistema
    Usuario -->|cadastrar tarefa| Sistema
    Usuario -->|visualizar quadro| Sistema
    Usuario -->|editar tarefa| Sistema
    Usuario -->|alterar status e prioridade| Sistema
    Usuario -->|excluir tarefa| Sistema
    Sistema --> Persistencia[(Banco de dados)]
```

Os diagramas podem ser exportados para JPG ou PNG usando qualquer renderizador Mermaid compatível.
