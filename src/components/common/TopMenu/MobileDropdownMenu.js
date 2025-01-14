import React, { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Menu } from 'react-feather';
import { useHistory } from 'react-router';
import * as PropTypes from 'prop-types';

export const MobileDropdownMenu = ({ menuItems, getIsActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  const toggle = () => setIsOpen((prevState) => !prevState);
  const close = () => setIsOpen(false);
  const clickItem = (goTo) => () => {
    history.push(goTo);
    close();
  };

  return (
    <Dropdown isOpen={isOpen} toggle={toggle}>
      <DropdownToggle
        className="p-3"
        tag="div"
        data-toggle="dropdown"
        aria-expanded={isOpen}>
        <Menu />
      </DropdownToggle>
      <DropdownMenu>
        {menuItems.map((item) => (
          <div key={item.name}>
            <Link
              className={`nav-link h-100 ${
                getIsActive(item.goTo) ? 'active' : ''
              }`}
              onClick={clickItem(item.goTo)}>
              {item.name}
            </Link>
          </div>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

MobileDropdownMenu.propTypes = {
  menuItems: PropTypes.array,
  currentTab: PropTypes.string,
};
