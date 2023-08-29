import {Button, Text, Icon, Grid } from "@shopify/polaris";

export function GenericTitleBar(props) {
	return (
		<>
		<div style={{borderBottom: '1px solid #E1E3E5', marginTop: '30px'}}>
			<Grid>
				<Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 10, xl: 4}}>
					<div style={{display: 'flex', float:'left', gap: '10px'}}>
						{props.icon ? (
							<Icon
								source={props.icon}
								color="base"
							/>) : (
								<img src={props.image}></img>
						)}
						<Text size="small">
							{props.title}
						</Text>
					</div>
				</Grid.Cell>
				{props.buttonText ? (
					<Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 2, xl: 4}}>
						<div style={{display: 'flex', justifyContent: 'end'}}> 
						<Button primary onClick={props?.handleButtonClick}>{props.buttonText}</Button>
						</div>
				</Grid.Cell>
				): null}
			</Grid>
			<div className="space-4"></div>
    </div>
		<div className="space-10"></div>
		</>
	)
};
