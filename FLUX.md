
# Clean Arc Flux Example

- O usuário faz uma chamada http POST na rota "/questions" passando os dados para o CreateQuestionController.
- O CreateQuestionController utiliza o "execute" do CreateQuestionUseCase (que se tornou injetável para o Nest), que por sua fez utiliza o método "create" do QuestionsRepository.
- O NestJS intercepta essa chamada ao método "create" e ao invés de utilizar o QuestionsRepository, ele utiliza o PrismaQuestionsRepository, que implementa o QuestionsRepository e faz as operações dentro do banco de dados através do PrismaService, que implementa o PrismaClient.
- 
