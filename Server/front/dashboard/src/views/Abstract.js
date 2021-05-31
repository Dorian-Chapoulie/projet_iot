import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Card,
	Container,
	CardHeader,
	CardBody,
	CardImg,
	CardTitle,
	CardText,
	Row,
	Col,
} from "reactstrap";

import dorian from '../assets/dorian.jpg';
import remi from '../assets/remi.png';
import leo from '../assets/leo.jpg';
import raph from '../assets/raph.jpg';

import './Abstract.css';

export const Abstract = () => {

	return (
		<Container className="white text-center">
			<Row className="wpJupiter">
			</Row>
			<Row>
				<Col xs="12">
					<h1 className="mt-3">Présentation du projet Jupiter</h1>
					<p>Jupiter est une mission d'exploration des locaux de la MIAGE.</p>
					<span>
						La mission consiste à déployer l'astromobile Jupiter sur le sol terrien
						pour étudier sa surface et collecter des données concernant la
						température de celle-ci.
						L'objectif final est de transférer ces données à un utilisateur contrôlant le
						robot à distance afin d’obtenir une « heat-map » des locaux.
						L’utilisateur percevra un flux vidéo généré à partir d’un ESP32-CAM
						installé sur Jupiter.
					</span>
				</Col>
				<Col className="mt-5">
					<h1>Membres de l'équipe</h1>
					<div className=" card-group">
						<Card className="mx-2">
							<CardImg
								alt="..."
								src={dorian}
								top
							></CardImg>
							<p className="black pt-1 mt-2">Dorian Chapoulié</p>

						</Card>
						<Card className="mx-2">
							<CardImg
								alt="..."
								src={remi}
								top
							></CardImg>
							<p className="black pt-1 mt-2">Rémi Longin</p>

						</Card>
						<Card className="mx-2">
							<CardImg
								alt="..."
								src={leo}
								top
							></CardImg>
							<p className="black pt-1 mt-2">Léo Guillaumet</p>

						</Card>
						<Card className="mx-2">
							<CardImg
								alt="..."
								src={raph}
								top
							></CardImg>
							<p className=" black pt-1 mt-2">Raphaël Bolier</p>

						</Card>
					</div>
				</Col>

			</Row>
			<Row>
				<Col className="mt-5">
					<h3>Sous la direction de Mr Gilles Menez</h3>
				</Col>
			</Row>

			<Row className="wpMiage">
			</Row>

		</Container>
	)
}