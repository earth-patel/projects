import Card from './Card';
import { useAppSelector } from '../store/index';

const OrganizationList = () => {
  const { organizations } = useAppSelector(state => state.organization);

  return (
    <div>
      <h2>My Organizations</h2>

      <div className="organization-list-grid">
        {organizations.map(org => (
          <Card
            key={org.organizationId}
            title={org.organizationName}
            subtitle={`Role: ${org.role}`}
          />
        ))}
      </div>
    </div>
  );
};

export default OrganizationList;
