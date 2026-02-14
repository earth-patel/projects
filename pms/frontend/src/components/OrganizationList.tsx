import { useEffect } from 'react';

import Card from './Card';
import { useAppDispatch, useAppSelector } from '../store/index';
import { clearOrganizations } from '../store/organization/organization.slice';
import { listMyOrganizations } from '../store/organization/organization.thunk';

const OrganizationList = () => {
  const dispatch = useAppDispatch();
  const { organizations, organizationLoading } = useAppSelector(
    state => state.organization
  );

  useEffect(() => {
    dispatch(listMyOrganizations());

    return () => {
      dispatch(clearOrganizations());
    };
  }, [dispatch]);

  if (organizationLoading) return <div>Loading organizations...</div>;

  return (
    <div className="organization-list-grid">
      {organizations.map(org => (
        <Card key={org.id} title={org.name} subtitle={`Role: ${org.role}`} />
      ))}
    </div>
  );
};

export default OrganizationList;
