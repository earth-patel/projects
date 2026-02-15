import { useEffect, useState } from 'react';

import FormInput from '../components/FormInput';
import FormModal from '../components/FormModal';
import OrganizationList from '../components/OrganizationList';
import { useAppDispatch, useAppSelector } from '../store/index';
import {
  clearCreateOrganizationError,
  setCreateOrganizationError
} from '../store/organization/organization.slice';
import {
  createOrganization,
  listMyOrganizations
} from '../store/organization/organization.thunk';

const OrganizationSelection = () => {
  const dispatch = useAppDispatch();
  const { createOrganizationError, createOrganizationLoading } = useAppSelector(
    state => state.organization
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orgName, setOrgName] = useState('');

  useEffect(() => {
    return () => {
      dispatch(clearCreateOrganizationError());
    };
  }, [dispatch]);

  const validate = () => {
    if (!orgName.trim()) {
      dispatch(
        setCreateOrganizationError({
          errors: { name: 'Organization name is required' }
        })
      );
      return false;
    }
    return true;
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setOrgName('');
    dispatch(clearCreateOrganizationError());
  };

  const handleCreateOrganization = () => {
    dispatch(createOrganization(orgName))
      .unwrap()
      .then(() => {
        dispatch(listMyOrganizations());
        onCloseModal();
      });
  };

  return (
    <div className='container'>
      <OrganizationList />

      <button
        className="btn btn-primary"
        style={{ marginTop: '20px' }}
        onClick={() => setIsModalOpen(true)}
      >
        Create Organization
      </button>

      {/* Create Organization Modal */}
      <FormModal
        isOpen={isModalOpen}
        title="Create Organization"
        onClose={onCloseModal}
        onSubmit={handleCreateOrganization}
        submitText="Create"
        validate={validate}
        loading={createOrganizationLoading}
        loadingText="Creating..."
      >
        <FormInput
          type="text"
          name="organizationName"
          placeholder="Organization name"
          error={createOrganizationError?.errors?.name}
          onChange={e => setOrgName(e.target.value)}
          required
        />
      </FormModal>
    </div>
  );
};

export default OrganizationSelection;
