import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';

import Error from '../components/Error';
import FormInput from '../components/FormInput';
import FormModal from '../components/FormModal';
import Loading from '../components/Loading';
import { useAppDispatch, useAppSelector } from '../store/index';
import {
  clearProjectError,
  setProjectError
} from '../store/project/project.slice';
import {
  createProject,
  deleteProject,
  listProjects
} from '../store/project/project.thunk';
import { type ProjectItem } from '../store/project/project.types';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const { selectedOrganization } = useAppSelector(state => state.organization);
  const {
    projects,
    projectLoading,
    createProjectLoading,
    deleteProjectLoading,
    projectError
  } = useAppSelector(state => state.project);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!selectedOrganization) return;
    dispatch(listProjects(selectedOrganization.id));
  }, [dispatch, selectedOrganization]);

  if (!user) <Loading />;
  if (!selectedOrganization)
    return <Navigate to="/organization-selection" replace />;

  const canManageProjects = ['OWNER', 'ADMIN'].includes(
    selectedOrganization.role
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setName('');
    setDescription('');
    dispatch(clearProjectError());
  };

  const validateCreate = () => {
    if (!name.trim()) {
      dispatch(
        setProjectError({ errors: { name: 'Project name is required' } })
      );
      return false;
    }
    return true;
  };

  const handleCreate = () => {
    dispatch(
      createProject({
        orgId: selectedOrganization.id,
        name,
        description: description.trim() || undefined
      })
    )
      .unwrap()
      .then(() => {
        dispatch(listProjects(selectedOrganization.id));
        handleCloseModal();
      });
  };

  const handleDelete = (project: ProjectItem) => {
    dispatch(
      deleteProject({ orgId: selectedOrganization.id, projectId: project.id })
    )
      .unwrap()
      .then(() => {
        dispatch(listProjects(selectedOrganization.id));
      });
  };

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <div className="heading">Projects</div>
        </div>
        <div className="d-flex g-1">
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard/members')}
          >
            Members
          </button>
          {canManageProjects && (
            <button className="btn btn-primary" onClick={handleOpenModal}>
              New Project
            </button>
          )}
        </div>
      </div>

      {projectLoading ? (
        <Loading />
      ) : projects.length === 0 ? (
        <div className="subtitle">No projects yet.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Tasks</th>
              <th>Created by</th>
              {canManageProjects && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr
                key={project.id}
                className="cursor-pointer"
                onClick={() => navigate(`/dashboard/projects/${project.id}`)}
              >
                <td>{project.name}</td>
                <td>{project._count.tasks}</td>
                <td>
                  {project.createdBy.firstName} {project.createdBy.lastName}
                </td>
                {canManageProjects && (
                  <td onClick={e => e.stopPropagation()}>
                    <button
                      className="btn btn-danger btn-sm"
                      disabled={deleteProjectLoading}
                      onClick={() => handleDelete(project)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <FormModal
        isOpen={isModalOpen}
        title="New Project"
        onClose={handleCloseModal}
        onSubmit={handleCreate}
        submitText="Create"
        validate={validateCreate}
        loading={createProjectLoading}
        loadingText="Creating..."
      >
        <FormInput
          type="text"
          placeholder="Project name"
          value={name}
          error={projectError?.errors?.name}
          onChange={e => setName(e.target.value)}
        />
        <Error error={projectError?.errors?.general} />
      </FormModal>
    </div>
  );
};

export default Dashboard;
