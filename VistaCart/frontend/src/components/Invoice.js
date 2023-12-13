import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

function Invoice(props) {

    const [invoiceDetails, setInvoiceDetails] = useState(null);
    const [shippingDetails, setShippingDetails] = useState(null);
    
    // Create styles
    const styles = StyleSheet.create({
    page: { backgroundColor: 'white' },
    section: { fontSize: 32, textAlign: 'center', margin: 30, borderBottom: 1, paddingBottom: 20},
    content: {
        fontSize: 12, 
        marginLeft: 30,
        '@media max-width: 400': {
        flexDirection: 'column',
        },
        '@media min-width: 400': {
        flexDirection: 'row',
        },
    },
    
    block: {
        height: 90,
        width: '100%',
        flexDirection: 'column',
    },
    table: {
        fontSize: 12, 
        margin: 30,
        textAlign: 'center',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        borderTop: '1px solid #EEE',
        paddingTop: 8,
        paddingBottom: 8,
    },
    header: {
        borderTop: 'none',
    },
    bold: {
        fontWeight: 700,
    },
    name: {
        width: '30%',
    },
    sku: {
        width: '15%',
    },
    size: {
        width: '15%',
    },
    qty: {
        width: '15%',
    },
    price: {
        width: '15%',
    },
    total:{
        margin:30,
        borderTop: '3px solid #EEE',
        paddingTop: 15,
        paddingBottom: 15,
        borderBottom: '3px solid #EEE',
        textAlign: 'right',
        },
        pageNumber: {
            marginLeft:30,
            position: "absolute",
            fontSize: 12,
            bottom: 30,
            left: 0,
            right: 0,
            textA1ign: "center",
            color: "grey"
        },
    });

    useEffect(() => {
        const orderNumber = props.orderNumber;
        
        async function fetchInvoiceDetails() {
        try {
            await axios.post("http://localhost:8080/api/order/getInvoiceDetails", {
            orderNumber: orderNumber,
            }).then((response) => {
            if (response.status === 200) {
                setInvoiceDetails(response.data.InvoiceDetails[0]);
                setShippingDetails(response.data.shippingDetails[0]);
            } else {
                console.error('Error fetching Invoice details');
                setInvoiceDetails(null);
                setShippingDetails(null);
            }
            });
        } catch (error) {
            console.error('Error fetching Invoice details:', error);
            setInvoiceDetails(null);
            setShippingDetails(null);
        }
        }

        fetchInvoiceDetails();


    }, [props.orderNumber]);
  

    return (
      <>
      
            {invoiceDetails && invoiceDetails.length > 0 ? (
                <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text  style={styles.bold}>VISTACART</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.block}>
          <Text>Order Summary</Text>
            <Text>{shippingDetails.firstname} {shippingDetails.lastname}</Text>
          <Text >Invoice Date: {new Date(invoiceDetails.orderDate).toLocaleString()}</Text>
          <Text >Order #: {props.orderNumber}</Text>
        </View>
        <View style={styles.block}>
          <Text>Shipping Details</Text>
          <Text >{shippingDetails.address}</Text>
          <Text >{shippingDetails.city}, {shippingDetails.zipcode}</Text>
        </View>
      </View>
      <View style={styles.table}>
      <View style={[styles.row, styles.bold, styles.header]}>
        <Text style={styles.name}>Name</Text>
        <Text style={styles.sku}>SKU</Text>
        <Text style={styles.size}>Size</Text>
        <Text style={styles.qty}>Quantity</Text>
        <Text style={styles.price}>Price</Text>
    </View>
    <View style={styles.row} wrap={false}>
        <Text style={styles.name}>Nike Air Force 1 '07 LV8</Text>
        <Text style={styles.sku}>123123</Text>
        <Text style={styles.size}>8</Text>
        <Text style={styles.qty}>4</Text>
        <Text style={styles.price}>170.00</Text>
    </View>
            <View style={styles.row} wrap={false}>
        <Text style={styles.name}>Nike Air Force 1 '07 LV8</Text>
        <Text style={styles.sku}>123123</Text>
        <Text style={styles.size}>8</Text>
        <Text style={styles.qty}>4</Text>
        <Text style={styles.price}>170.00</Text>
    </View>
            <View style={styles.row} wrap={false}>
        <Text style={styles.name}>Nike Air Force 1 '07 LV8</Text>
        <Text style={styles.sku}>123123</Text>
        <Text style={styles.size}>8</Text>
        <Text style={styles.qty}>4</Text>
        <Text style={styles.price}>170.00</Text>
    </View>
    </View>
      <View style={styles.total}>
        <Text>Total: $ {invoiceDetails.totalAmount}</Text>
              </View>
              {/* {data.map((row, i) => (
        <View key={i} style={styles.row} wrap={false}>
          <Text style={styles.row1}>
            <Text style={styles.bold}>{row.lastName}</Text>, {row.firstName}
          </Text>
          <Text style={styles.row2}>{row.startDate}</Text>
          <Text style={styles.row3}>{row.endDate}</Text>
          <Text style={styles.row4}>
            <Text style={styles.bold}>{row.days}</Text> of{' '}
            {maximumDays}
          </Text>
          <Text style={styles.row5}>{row.info}</Text>
        </View>
      ))} */}   
              <Text
                  style={styles.pageNumber} render={({pageNumber, totalPages}) => `${pageNumber} / ${totalPages}`} fixed>
              </Text>
                    </Page>
                    </Document>
            ) : (
                    <Document>
                        <Page size="A4" style={styles.page}>
                            <View style={styles.section}>
                                <Text style={styles.bold}>Cannot get invoice data</Text>
                            </View>  
                        </Page>
                    </Document>  
            )};
        </>
    )
}

export default Invoice