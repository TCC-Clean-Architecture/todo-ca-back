import { chooseRepositoryByEnvironment } from '../utils/repositoryByEnvironment'
import { type ITodoRepository, type IUsersRepository } from './repositoryInterfaces'

export type IRepositoriesLocale = 'memory' | 'mongo'
type IRepositoriesAvailable = 'todoRepository' | 'usersRepository'

let todoRepository: ITodoRepository
let usersRepository: IUsersRepository

async function dynamicImportRepository <T> (repositoryToUse: IRepositoriesLocale, repository: IRepositoriesAvailable): Promise<T> {
  const module = await import(`./${repositoryToUse}/${repository}`)
  return module[repository]
}

const initializeRepository = async (): Promise<void> => {
  todoRepository = await dynamicImportRepository<ITodoRepository>(chooseRepositoryByEnvironment(process.env.NODE_ENV), 'todoRepository')
  usersRepository = await dynamicImportRepository<IUsersRepository>(chooseRepositoryByEnvironment(process.env.NODE_ENV), 'usersRepository')
}
export {
  initializeRepository,
  todoRepository,
  usersRepository
}
