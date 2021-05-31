import React, { useState } from 'react';
import {
	Navbar,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
} from 'reactstrap';

import logo from '../../assets/logoJupiter.png';
import PopOverContainer from "../../components/popOver/popOverContainer";

import './NavBar.css';

export const NavBar = () => {

	return (
		<div className="NavBarJupiter">
			<Navbar color="dark" expand="md">
				<NavbarBrand className="LogoTitle" href="/">Jupiter
				<img
						src={logo}
						width="50"
						height="50"
						className="ml-3 d-inline-block align-middle"
						alt="Jupiter logo"
					/>
				</NavbarBrand>
				<Nav className="m-auto" navbar>
					<NavItem>
						<NavLink className="mx-2" href="/">Accueil</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="/heatmap">Heatmap</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="/abstract">Le projet</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="mx-2" href="https://github.com/Dorian-Chapoulie/projet_iot">GitHub du projet</NavLink>
					</NavItem>
				</Nav>
				<PopOverContainer />
			</Navbar>
		</div>
	);

}