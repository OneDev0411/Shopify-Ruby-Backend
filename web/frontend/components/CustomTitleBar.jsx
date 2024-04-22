import {Button, Text, Grid } from "@shopify/polaris";

export function CustomTitleBar({title, image, buttonText, handleButtonClick, secondaryButtonText, handleSecondaryButtonClick}) {
	return (
		<>
			<div style={{borderBottom: '1px solid #E1E3E5'}}>
				<Grid>
					<Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
						<div className="title-bar-title">
							<img src={image} />
							<Text variant="headingLg" as="h1" fontWeight="medium">
								{title}
							</Text>
						</div>
					</Grid.Cell>
					{buttonText ? (
							secondaryButtonText ? (
									<>
										<Grid.Cell columnSpan={{xs: 6, sm: 2, md: 2, lg: 5, xl: 5}}>
											<div className="title-bar-secondary-button">
												<Button secondary onClick={handleSecondaryButtonClick}>{secondaryButtonText}</Button>
											</div>
										</Grid.Cell>
										<Grid.Cell columnSpan={{xs: 6, sm: 1, md: 1, lg: 1, xl: 1}}>
											<div className="title-bar-button title-button-alt">
												<Button primary onClick={handleButtonClick}>{buttonText}</Button>
											</div>
										</Grid.Cell>
									</>
								) : (
								<Grid.Cell columnSpan={{xs: 6, sm: 2, md: 3, lg: 2, xl: 6}}>
									<div className="title-bar-button">
										<Button primary onClick={handleButtonClick}>{buttonText}</Button>
									</div>
								</Grid.Cell>
							)
					): null}
				</Grid>
				<div className="space-4"></div>
			</div>
			<div className="space-4"></div>
		</>
	)
};
