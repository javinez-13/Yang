const AdminPageHeader = ({ title, subtitle = 'YangConnect • Admin Portal', description, actions }) => (
  <div className="admin-page-header">
    <div>
      <p className="admin-page-crumb">{subtitle}</p>
      <h2>{title}</h2>
      {description && <p className="page-note">{description}</p>}
    </div>
    <div className="admin-page-actions">
      {actions}
    </div>
  </div>
);

export default AdminPageHeader;


