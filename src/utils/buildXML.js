function mapItems(items) {
	const output = items.map((item, index) => {
		console.log('## ITEM', item)
		const {price, sku, totalAmount, description, quantity} = item
		return `
			<ItemOut lineNumber="${index + 1}" quantity="${quantity}">
				<ItemID>
					<SupplierPartID>${sku}</SupplierPartID>
				</ItemID>
				<ItemDetail>
					<UnitPrice>
						<Money currency="USD">${price}</Money>
					</UnitPrice>
					<Description>${description}</Description>
					<UnitOfMeasure>EA</UnitOfMeasure>
					<Classification domain="UNSPSC">0</Classification>
					<Extrinsic name="LineType">Quantity</Extrinsic>
				</ItemDetail>
				<Distribution>
					<Accounting name="Brighton-Best">
						<Segment description="Company" id="1000" type="Company" />
						<Segment description="Acct Cat" id="K" type="Acct Cat" />
						<Segment description="GL Acct" id="645010" type="GL Acct" />
						<Segment description="Cost Ctr" id="F2102" type="Cost Ctr" />
					</Accounting>
					<Charge>
						<Money currency="USD">${totalAmount}</Money>
					</Charge>
				</Distribution>
			</ItemOut>
		`
	})
	return output.join('')
}

export default function parseXML({values, products}) {
	const {
		name,
		email,
		phone,
		deliverToName,
		deliverTo,
		deliverToStreet,
		deliverToCity,
		deliverToState,
		deliverToPostalCode,
		deliverToCountry,
		deliverToEmail,
		nameBill,
		deliverToBill,
		streetBill,
		cityBill,
		stateBill,
		postalCodeBill,
		countryBill,
		carrierCode,
		carrierName,
		carrierId,
		carrierPhone,
		carrierContactEmail,
		carrierContactName
	} = values
	const today = new Date()
	const element = `
    <Order timestamp=${today}>
	<Header>
		<From>
			<Credential>
				<Name>Sodimac</Name>
				<Email/>
				<Phone/>
			</Credential>
		</From>
		<To>
			<Credential>
				<Name>Global Industrial</Name>
				<Email/>
				<Phone/>
			</Credential>
		</To>
		<Sender>
			<Credential>
				<Name>${name}</Name>
				<Email>${email}</Email>
				<Phone>${phone}</Phone>
			</Credential>
			<UserAgent>Coupa Procurement 1.0</UserAgent>
		</Sender>
	</Header>
	<Request deploymentMode="production">
		<OrderRequest>
			<OrderRequestHeader divisionKey="1" accountKey="5353131" orderType="regular" type="new" orderDate="2019-04-25T15:31:15-07:00" orderID="1000002459">
				<Total>
					<Money currency="USD">333.15</Money>
				</Total>
				<ShipTo>
					<Address>
						<Name>${deliverToName}</Name>
						<PostalAddress>
							<DeliverTo>${deliverTo}</DeliverTo>
							<Street>${deliverToStreet}</Street>
							<City>${deliverToCity}</City>
							<State>${deliverToState}</State>
							<PostalCode>${deliverToPostalCode}</PostalCode>
							<Country isoCountryCode="CL">${deliverToCountry}</Country>
						</PostalAddress>
						<Email>${deliverToEmail}</Email>
					</Address>
				</ShipTo>
				<BillTo>
					<Address>
						<Name>${nameBill}</Name>
						<PostalAddress>
							<DeliverTo>${deliverToBill}</DeliverTo>
							<Street>${streetBill}</Street>
							<City>${cityBill}</City>
							<State>${stateBill}</State>
							<PostalCode>${postalCodeBill}</PostalCode>
							<Country isoCountryCode="CL">${countryBill}</Country>
						</PostalAddress>
					</Address>
				</BillTo>
				<Shipping>
					<Money currency="USD">0.0</Money>
					<Description>1.FCA - FREE CARRIER</Description>
					<FreightCharge>Collect</FreightCharge>
					<Carrier>
						<CarrierCode>${carrierCode}</CarrierCode>
						<CarrierName>${carrierName}</CarrierName>
						<CarrierID>${carrierId}</CarrierID>
						<CarrierPhone>${carrierPhone}</CarrierPhone>
					</Carrier>
				</Shipping>
				<Contact role="endUser">
					<Name>${carrierContactName}</Name>
					<Email>${carrierContactEmail}</Email>
				</Contact>
			</OrderRequestHeader>
			<OrderRequestDetail>
			${mapItems(products)}
			</OrderRequestDetail>
		</OrderRequest>
	</Request>
</Order>
`

	return element
}
