import { FC } from "react";

const Header: FC = () => {
  return (
    <div className="w-100 h-25">
      <div className="container h-100 py-4">
        <div className="fs-4 h-100 d-flex align-items-center fw-bold">
          <span className="nav-logo-left">TODO</span>
          <span className="nav-logo-right">APP</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
