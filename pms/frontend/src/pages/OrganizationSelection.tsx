import OrganizationList from '../components/OrganizationList';

const OrganizationSelection = () => {
  return (
    <div>
      <OrganizationList />

      <button style={{ marginTop: '20px' }}>Create Organization</button>
    </div>
  );
};

export default OrganizationSelection;
