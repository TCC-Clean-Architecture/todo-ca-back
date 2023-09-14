import { chooseRepositoryByEnvironment } from '../utils/repositoryByEnvironment'
import { type ITodoRepository } from './repositoryInterfaces'

export type IRepositoriesLocale = 'memory' | 'mongo'
type IRepositoriesAvailable = 'todoRepository'

let todoRepository: ITodoRepository

async function dynamicImportRepository <T> (repositoryToUse: IRepositoriesLocale, repository: IRepositoriesAvailable): Promise<T> {
  const module = await import(`./${repositoryToUse}/${repository}`)
  return module[repository]
}

const initializeRepository = async (): Promise<void> => {
  todoRepository = await dynamicImportRepository<ITodoRepository>(chooseRepositoryByEnvironment(process.env.NODE_ENV), 'todoRepository')
}
export {
  initializeRepository,
  todoRepository
}
