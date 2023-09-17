import { type IRepositoriesLocale } from '../repositories'

function chooseRepositoryByEnvironment (env: string | null | undefined): IRepositoriesLocale {
  if (env === null || env === undefined) {
    return 'memory'
  }
  return env === 'test' ? 'memory' : 'mongo'
}

export { chooseRepositoryByEnvironment }
