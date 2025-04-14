import React, { useState, FormEvent, useEffect } from "react";
import { FiChevronRight } from 'react-icons/fi'
import logoImg from '../../assets/Logo.svg';
import api from '../../services/api'
import { Link } from 'react-router-dom'
import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
const [repositories, setRepositories] = useState<Repository[]>(() => {
  const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');

  try {
    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }
  } catch (error) {
    console.error('Erro ao fazer parse do localStorage:', error);
    localStorage.removeItem('@GithubExplorer:repositories');
  }

  return [];
});


  useEffect(() => {
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
  }, [repositories])

  async function handleAddrepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o auto/nome do repositório');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);
      console.log(response.data);
      const repository = response.data;
      setRepositories([...repositories, repository])
      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca por esse repositório');
    }

  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios no Github</Title>
      <Form hasError={!!inputError} onSubmit={handleAddrepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório" />
        <button type="submit">Pesquisa</button>
      </Form>



      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories?.map(repository => (
          <Link key={repository.full_name} to={`/explorer.github.io/repository/${repository.full_name}`}>
            <img src={repository.owner.avatar_url}
              alt={repository.owner.login} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
}

export default Dashboard;
