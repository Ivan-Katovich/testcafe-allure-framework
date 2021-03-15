export const trademark = {
    change: {
        'ta change': {
            'DisplayConfiguredName': 'TM All Cases TA change',
            'DisplayConfiguredDescription': 'query for change',
            'Description': 'query for change',
            'QueryGroupIds': [],
            'ContentGroups': [
                {
                    'ContentGroupId': 3420,
                    'ContentGroupName': 'Test Automation CG',
                    'IsActive': true
                }
            ],
            'SourceIpTypes': [
                {
                    'IpTypeId': 3,
                    'Name': 'TrademarkMasters',
                    'Description': 'TrademarkMasters',
                    'LicensedRecordCount': 100000,
                    'UsedRecordCount': 0,
                    'ElementName': 'TrademarkMasters'
                }
            ],
            'QueryMetadata': {
                'ResultFields': [
                    {
                        'Display': 'Docket Number',
                        'Value': 'QRYTM_MASTERMARK.TMM$DOCKETNUMBER',
                        'DataInfo': {
                            'DataDictionaryId': 4006,
                            'OriginalTableName': 'TRADEMARKMASTERS',
                            'OriginalFieldName': 'DOCKETNUMBER',
                            'OriginalLabel': 'Docket Number',
                            'DefinedSize': 30,
                            'FieldAliasName': 'TMM$DOCKETNUMBER',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Docket Number',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 3,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Create Date',
                        'Value': 'QRYTM_MASTERMARK.TMM$CREATEDATE',
                        'DataInfo': {
                            'DataDictionaryId': 4049,
                            'OriginalTableName': 'TRADEMARKMASTERS',
                            'OriginalFieldName': 'CREATEDATE',
                            'OriginalLabel': 'Create Date',
                            'DefinedSize': 8,
                            'FieldAliasName': 'TMM$CREATEDATE',
                            'DataType': 'datetime',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Create Date',
                            'EditControlType': 'EDT0000005',
                            'IsPrimaryKey': false,
                            'ApplicationId': 3,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Create User',
                        'Value': 'QRYTM_MASTERMARK.TMM$CREATEUSER',
                        'DataInfo': {
                            'DataDictionaryId': 3961,
                            'OriginalTableName': 'TRADEMARKMASTERS',
                            'OriginalFieldName': 'CREATEUSER',
                            'OriginalLabel': 'Create User',
                            'DefinedSize': 128,
                            'FieldAliasName': 'TMM$CREATEUSER',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Create User',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 3,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Country / Region',
                        'Value': 'QRYTM_MASTERMARK.TMM$COUNTRY',
                        'DataInfo': {
                            'DataDictionaryId': 3884,
                            'OriginalTableName': 'TRADEMARKMASTERS',
                            'OriginalFieldName': 'COUNTRY',
                            'OriginalLabel': 'Country',
                            'DefinedSize': 4,
                            'FieldAliasName': 'TMM$COUNTRY',
                            'DataType': 'int',
                            'LookupSource': 'COUNTRIES',
                            'LookupSourceType': null,
                            'CustomValue': 'Country / Region',
                            'EditControlType': 'EDT0000003',
                            'IsPrimaryKey': false,
                            'ApplicationId': 3,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': true,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Case Type',
                        'Value': 'QRYTM_MASTERMARK.TMM$CASETYPE',
                        'DataInfo': {
                            'DataDictionaryId': 3887,
                            'OriginalTableName': 'TRADEMARKMASTERS',
                            'OriginalFieldName': 'CASETYPE',
                            'OriginalLabel': 'Case Type',
                            'DefinedSize': 10,
                            'FieldAliasName': 'TMM$CASETYPE',
                            'DataType': 'nchar',
                            'LookupSource': 'CODES',
                            'LookupSourceType': 'CST',
                            'CustomValue': 'Case Type',
                            'EditControlType': 'EDT0000003',
                            'IsPrimaryKey': false,
                            'ApplicationId': 3,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': true
                        }
                    },
                    {
                        'Display': 'Status',
                        'Value': 'QRYTM_MASTERMARK.TMM$STATUS',
                        'DataInfo': {
                            'DataDictionaryId': 3890,
                            'OriginalTableName': 'TRADEMARKMASTERS',
                            'OriginalFieldName': 'STATUS',
                            'OriginalLabel': 'Status',
                            'DefinedSize': 10,
                            'FieldAliasName': 'TMM$STATUS',
                            'DataType': 'nchar',
                            'LookupSource': 'CODES',
                            'LookupSourceType': 'STT',
                            'CustomValue': 'Status',
                            'EditControlType': 'EDT0000003',
                            'IsPrimaryKey': false,
                            'ApplicationId': 3,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': true
                        }
                    },
                    {
                        'Display': 'TRADEMARKMASTERID',
                        'Value': 'QRYTM_MASTERMARK.TMM$TRADEMARKMASTERID',
                        'DataInfo': {
                            'DataDictionaryId': 3928,
                            'OriginalTableName': 'TRADEMARKMASTERS',
                            'OriginalFieldName': 'TRADEMARKMASTERID',
                            'OriginalLabel': 'TRADEMARKMASTERID',
                            'DefinedSize': 4,
                            'FieldAliasName': 'TMM$TRADEMARKMASTERID',
                            'DataType': 'int',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'TRADEMARKMASTERID',
                            'EditControlType': null,
                            'IsPrimaryKey': true,
                            'ApplicationId': 3,
                            'DbPrimaryKey': '1',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    }
                ],
                'From': 'QRYTM_MASTERMARK',
                'OrderBy': [
                    {
                        'FieldAlias': 'TMM$CREATEDATE',
                        'SortDirection': 1
                    }
                ],
                'Source': 'QRYTM_MASTERMARK',
                'QueryType': 0,
                'AdditionalFilters': [],
                'FieldMetadata': null,
                'AllFieldMetadata': null,
                'SecurityFilters': null,
                'PlainTextFilter': ' ',
                'DisplayCaseImage': false,
                'DataModificationFormApplicable': true,
                'IpType': 3,
                'MasterIdFieldAliasName': 'TMM$TRADEMARKMASTERID',
                'MasterTableName': 'TRADEMARKMASTERS',
                'MasterIdFieldName': 'TRADEMARKMASTERID',
                'ResourceTypeName': 'QUERY',
                'OriginalFrom': null
            },
            'CreateUser': 'TestA@***.com',
            'UpdateUser': 'TestA@***.com',
            'CreateDate': '2019-06-06T14:23:39.917Z',
            'UpdateDate': '2019-06-06T14:23:39.917Z',
            'FormattedCreateDate': '2019-06-06T14:23:39.917',
            'FormattedUpdateDate': '2019-06-06T14:23:39.917',
            'ResourceId': 7006,
            'ResourceName': 'TM All Cases TA change',
            'IpType': 3
        }
    },
    create(name: string, contentGroup: {id: number, name: string} = null, queryGroupId: number = null) {
        return {
            'ResourceId': 0,
            'ResourceName': name,
            'Description': 'filter for TA records',
            'DisplayConfiguredName': name,
            'DisplayConfiguredDescription': 'filter for TA records',
            'SourceIpTypes': [
                {
                    'IpTypeId': 3,
                    'Name': 'TrademarkMasters',
                    'Description': 'TrademarkMasters',
                    'LicensedRecordCount': 100000,
                    'UsedRecordCount': 0,
                    'ElementName': 'TrademarkMasters'
                }
            ],
            'ContentGroups': contentGroup ? [
                {
                    'ContentGroupId': contentGroup.id,
                    'ContentGroupName': contentGroup.name ? contentGroup.name : 'Test Automation CG',
                    'IsActive': true,
                    'DisplaySettingId': 0,
                    'UpdateDate': '2019-07-26T12:00:26.227Z'
                }
            ] : [],
            'QueryGroupIds': queryGroupId ? [queryGroupId] : [],
            'QueryMetadata': {
                'FieldMetadata': null,
                'AdditionalFilters': [
                    {
                        'NumberOfLeftParentheses': 0,
                        'FieldAlias': 'TMM$DOCKETNUMBER',
                        'FilterOperator': 2,
                        'LeftFieldValue': 'trademark',
                        'NumberOfRightParentheses': 0,
                        'SubsequentLogicalOperator': 0,
                        'IsFieldComparisonFilter': false,
                        'Field': {
                            'DataDictionaryId': 4006,
                            'OriginalTableName': 'TRADEMARKMASTERS',
                            'OriginalFieldName': 'DOCKETNUMBER',
                            'OriginalLabel': 'Docket Number',
                            'DefinedSize': 30,
                            'FieldAliasName': 'TMM$DOCKETNUMBER',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Docket Number',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 3,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'NumberOfLeftParentheses': 0,
                        'FieldAlias': 'TMM$DOCKETNUMBER',
                        'FilterOperator': 2,
                        'LeftFieldValue': 'Simple',
                        'NumberOfRightParentheses': 0,
                        'SubsequentLogicalOperator': 0,
                        'IsFieldComparisonFilter': false,
                        'Field': {
                            'DataDictionaryId': 4006,
                            'OriginalTableName': 'TRADEMARKMASTERS',
                            'OriginalFieldName': 'DOCKETNUMBER',
                            'OriginalLabel': 'Docket Number',
                            'DefinedSize': 30,
                            'FieldAliasName': 'TMM$DOCKETNUMBER',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Docket Number',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 3,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    }
                ],
                'ResultFields': [
                    {
                        'Display': 'Docket Number',
                        'Value': 'QRYTM_MASTERMARK.TMM$DOCKETNUMBER',
                        'DataInfo': {
                            'DataDictionaryId': 4006,
                            'OriginalTableName': 'TRADEMARKMASTERS',
                            'OriginalFieldName': 'DOCKETNUMBER',
                            'OriginalLabel': 'Docket Number',
                            'DefinedSize': 30,
                            'FieldAliasName': 'TMM$DOCKETNUMBER',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Docket Number',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 3,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Create Date',
                        'Value': 'QRYTM_MASTERMARK.TMM$CREATEDATE',
                        'DataInfo': {
                            'DataDictionaryId': 4049,
                            'OriginalTableName': 'TRADEMARKMASTERS',
                            'OriginalFieldName': 'CREATEDATE',
                            'OriginalLabel': 'Create Date',
                            'DefinedSize': 8,
                            'FieldAliasName': 'TMM$CREATEDATE',
                            'DataType': 'datetime',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Create Date',
                            'EditControlType': 'EDT0000005',
                            'IsPrimaryKey': false,
                            'ApplicationId': 3,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Create User',
                        'Value': 'QRYTM_MASTERMARK.TMM$CREATEUSER',
                        'DataInfo': {
                            'DataDictionaryId': 3961,
                            'OriginalTableName': 'TRADEMARKMASTERS',
                            'OriginalFieldName': 'CREATEUSER',
                            'OriginalLabel': 'Create User',
                            'DefinedSize': 128,
                            'FieldAliasName': 'TMM$CREATEUSER',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Create User',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 3,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Country / Region',
                        'Value': 'QRYTM_MASTERMARK.TMM$COUNTRY',
                        'DataInfo': {
                            'DataDictionaryId': 3884,
                            'OriginalTableName': 'TRADEMARKMASTERS',
                            'OriginalFieldName': 'COUNTRY',
                            'OriginalLabel': 'Country',
                            'DefinedSize': 4,
                            'FieldAliasName': 'TMM$COUNTRY',
                            'DataType': 'int',
                            'LookupSource': 'COUNTRIES',
                            'LookupSourceType': null,
                            'CustomValue': 'Country / Region',
                            'EditControlType': 'EDT0000003',
                            'IsPrimaryKey': false,
                            'ApplicationId': 3,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': true,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Case Type',
                        'Value': 'QRYTM_MASTERMARK.TMM$CASETYPE',
                        'DataInfo': {
                            'DataDictionaryId': 3887,
                            'OriginalTableName': 'TRADEMARKMASTERS',
                            'OriginalFieldName': 'CASETYPE',
                            'OriginalLabel': 'Case Type',
                            'DefinedSize': 10,
                            'FieldAliasName': 'TMM$CASETYPE',
                            'DataType': 'nchar',
                            'LookupSource': 'CODES',
                            'LookupSourceType': 'CST',
                            'CustomValue': 'Case Type',
                            'EditControlType': 'EDT0000003',
                            'IsPrimaryKey': false,
                            'ApplicationId': 3,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': true
                        }
                    },
                    {
                        'Display': 'Status',
                        'Value': 'QRYTM_MASTERMARK.TMM$STATUS',
                        'DataInfo': {
                            'DataDictionaryId': 3890,
                            'OriginalTableName': 'TRADEMARKMASTERS',
                            'OriginalFieldName': 'STATUS',
                            'OriginalLabel': 'Status',
                            'DefinedSize': 10,
                            'FieldAliasName': 'TMM$STATUS',
                            'DataType': 'nchar',
                            'LookupSource': 'CODES',
                            'LookupSourceType': 'STT',
                            'CustomValue': 'Status',
                            'EditControlType': 'EDT0000003',
                            'IsPrimaryKey': false,
                            'ApplicationId': 3,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': true
                        }
                    },
                    {
                        'Display': 'TRADEMARKMASTERID',
                        'Value': 'QRYTM_MASTERMARK.TMM$TRADEMARKMASTERID',
                        'DataInfo': {
                            'DataDictionaryId': 3928,
                            'OriginalTableName': 'TRADEMARKMASTERS',
                            'OriginalFieldName': 'TRADEMARKMASTERID',
                            'OriginalLabel': 'TRADEMARKMASTERID',
                            'DefinedSize': 4,
                            'FieldAliasName': 'TMM$TRADEMARKMASTERID',
                            'DataType': 'int',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'TRADEMARKMASTERID',
                            'EditControlType': null,
                            'IsPrimaryKey': true,
                            'ApplicationId': 3,
                            'DbPrimaryKey': '1',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    }
                ],
                'OrderBy': [
                    {
                        'FieldAlias': 'TMM$CREATEDATE',
                        'SortDirection': 1
                    }
                ],
                'IpType': 3,
                'DisplayCaseImage': false,
                'DataModificationFormApplicable': true,
                'Source': 'QRYTM_MASTERMARK',
                'QueryType': 0,
                'From': 'QRYTM_MASTERMARK',
                'PlainTextFilter': null,
                'MasterIdFieldAliasName': 'TMM$TRADEMARKMASTERID',
                'MasterTableName': 'TRADEMARKMASTERS',
                'MasterIdFieldName': 'TRADEMARKMASTERID'
            },
            'IpType': 3
        };
    }
};

export const patent = {
    change: {},
    create(name: string, contentGroup: {id: number, name?: string} = null, queryGroupId: number = null) {
        return {
            'ResourceId': 0,
            'ResourceName': name,
            'Description': 'query to filter TA patents',
            'DisplayConfiguredName': name,
            'DisplayConfiguredDescription': 'query to filter TA patents',
            'SourceIpTypes': [
                {
                    'IpTypeId': 1,
                    'Name': 'PatentMasters',
                    'Description': 'PatentMasters',
                    'LicensedRecordCount': 1000000,
                    'UsedRecordCount': 0,
                    'ElementName': 'PatentMasters'
                }
            ],
            'ContentGroups': contentGroup ? [
                {
                    'ContentGroupId': contentGroup.id,
                    'ContentGroupName': contentGroup.name ? contentGroup.name : 'Test Automation CG',
                    'IsActive': true,
                    'DisplaySettingId': 0,
                    'UpdateDate': '2019-05-22T09:11:39.393Z'
                }
            ] : [],
            'QueryGroupIds': queryGroupId ? [queryGroupId] : [],
            'QueryMetadata': {
                'FieldMetadata': null,
                'AdditionalFilters': [
                    {
                        'NumberOfLeftParentheses': 0,
                        'FieldAlias': 'PAM$DOCKETNUMBER',
                        'FilterOperator': 2,
                        'LeftFieldValue': 'patent',
                        'NumberOfRightParentheses': 0,
                        'SubsequentLogicalOperator': 0,
                        'IsFieldComparisonFilter': false,
                        'Field': {
                            'DataDictionaryId': 3563,
                            'OriginalTableName': 'PATENTMASTERS',
                            'OriginalFieldName': 'DOCKETNUMBER',
                            'OriginalLabel': 'Docket Number',
                            'DefinedSize': 30,
                            'FieldAliasName': 'PAM$DOCKETNUMBER',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Docket Number',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 1,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'NumberOfLeftParentheses': 0,
                        'FieldAlias': 'PAM$DOCKETNUMBER',
                        'FilterOperator': 2,
                        'LeftFieldValue': 'Simple',
                        'NumberOfRightParentheses': 0,
                        'SubsequentLogicalOperator': 0,
                        'IsFieldComparisonFilter': false,
                        'Field': {
                            'DataDictionaryId': 3563,
                            'OriginalTableName': 'PATENTMASTERS',
                            'OriginalFieldName': 'DOCKETNUMBER',
                            'OriginalLabel': 'Docket Number',
                            'DefinedSize': 30,
                            'FieldAliasName': 'PAM$DOCKETNUMBER',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Docket Number',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 1,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    }
                ],
                'ResultFields': [
                    {
                        'Display': 'Docket Number',
                        'Value': 'QRYPA_MASTERTITLE.PAM$DOCKETNUMBER',
                        'DataInfo': {
                            'DataDictionaryId': 3563,
                            'OriginalTableName': 'PATENTMASTERS',
                            'OriginalFieldName': 'DOCKETNUMBER',
                            'OriginalLabel': 'Docket Number',
                            'DefinedSize': 30,
                            'FieldAliasName': 'PAM$DOCKETNUMBER',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Docket Number',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 1,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Create User',
                        'Value': 'QRYPA_MASTERTITLE.PAM$CREATEUSER',
                        'DataInfo': {
                            'DataDictionaryId': 3522,
                            'OriginalTableName': 'PATENTMASTERS',
                            'OriginalFieldName': 'CREATEUSER',
                            'OriginalLabel': 'Create User',
                            'DefinedSize': 128,
                            'FieldAliasName': 'PAM$CREATEUSER',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Create User',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 1,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Create Date',
                        'Value': 'QRYPA_MASTERTITLE.PAM$CREATEDATE',
                        'DataInfo': {
                            'DataDictionaryId': 3609,
                            'OriginalTableName': 'PATENTMASTERS',
                            'OriginalFieldName': 'CREATEDATE',
                            'OriginalLabel': 'Create Date',
                            'DefinedSize': 8,
                            'FieldAliasName': 'PAM$CREATEDATE',
                            'DataType': 'datetime',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Create Date',
                            'EditControlType': 'EDT0000005',
                            'IsPrimaryKey': false,
                            'ApplicationId': 1,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Country / Region',
                        'Value': 'QRYPA_MASTERTITLE.PAM$COUNTRY',
                        'DataInfo': {
                            'DataDictionaryId': 3452,
                            'OriginalTableName': 'PATENTMASTERS',
                            'OriginalFieldName': 'COUNTRY',
                            'OriginalLabel': 'Country',
                            'DefinedSize': 4,
                            'FieldAliasName': 'PAM$COUNTRY',
                            'DataType': 'int',
                            'LookupSource': 'COUNTRIES',
                            'LookupSourceType': null,
                            'CustomValue': 'Country / Region',
                            'EditControlType': 'EDT0000003',
                            'IsPrimaryKey': false,
                            'ApplicationId': 1,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': true,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Convention Type',
                        'Value': 'QRYPA_MASTERTITLE.PAM$CONVENTIONTYPE',
                        'DataInfo': {
                            'DataDictionaryId': 3451,
                            'OriginalTableName': 'PATENTMASTERS',
                            'OriginalFieldName': 'CONVENTIONTYPE',
                            'OriginalLabel': 'Convention Type',
                            'DefinedSize': 10,
                            'FieldAliasName': 'PAM$CONVENTIONTYPE',
                            'DataType': 'nchar',
                            'LookupSource': 'CODES',
                            'LookupSourceType': 'CNP',
                            'CustomValue': 'Convention Type',
                            'EditControlType': 'EDT0000007',
                            'IsPrimaryKey': false,
                            'ApplicationId': 1,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': true,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': true
                        }
                    },
                    {
                        'Display': 'PATENTMASTERID',
                        'Value': 'QRYPA_MASTERTITLE.PAM$PATENTMASTERID',
                        'DataInfo': {
                            'DataDictionaryId': 3619,
                            'OriginalTableName': 'PATENTMASTERS',
                            'OriginalFieldName': 'PATENTMASTERID',
                            'OriginalLabel': 'PATENTMASTERID',
                            'DefinedSize': 4,
                            'FieldAliasName': 'PAM$PATENTMASTERID',
                            'DataType': 'int',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'PATENTMASTERID',
                            'EditControlType': null,
                            'IsPrimaryKey': true,
                            'ApplicationId': 1,
                            'DbPrimaryKey': '1',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    }
                ],
                'OrderBy': [
                    {
                        'FieldAlias': 'PAM$CREATEDATE',
                        'SortDirection': 1
                    }
                ],
                'IpType': 1,
                'DisplayCaseImage': false,
                'DataModificationFormApplicable': true,
                'Source': 'QRYPA_MASTERTITLE',
                'QueryType': 0,
                'From': 'QRYPA_MASTERTITLE',
                'PlainTextFilter': null,
                'MasterIdFieldAliasName': 'PAM$PATENTMASTERID',
                'MasterTableName': 'PATENTMASTERS',
                'MasterIdFieldName': 'PATENTMASTERID'
            },
            'IpType': 1
        };
    }
};

export const disclosure = {
    create(name: string, contentGroup: {id: number, name: string} = null, queryGroupId: number = null) {
        return {
            'ResourceId': 0,
            'ResourceName': name,
            'Description': 'filter for TA records',
            'DisplayConfiguredName': name,
            'DisplayConfiguredDescription': 'filter for TA records',
            'SourceIpTypes': [
                {
                    'IpTypeId': 2,
                    'Name': 'DisclosureMasters',
                    'Description': 'DisclosureMasters',
                    'LicensedRecordCount': 10000,
                    'UsedRecordCount': 0,
                    'ElementName': 'DisclosureMasters'
                }
            ],
            'ContentGroups': contentGroup ? [
                {
                    'ContentGroupId': contentGroup.id,
                    'ContentGroupName': contentGroup.name ? contentGroup.name : 'Test Automation CG',
                    'IsActive': true,
                    'DisplaySettingId': 0,
                    'UpdateDate': '2019-07-26T12:00:26.227Z'
                }
            ] : [],
            'QueryGroupIds': queryGroupId ? [queryGroupId] : [],
            'QueryMetadata': {
                'FieldMetadata': null,
                'AdditionalFilters': [
                    {
                        'NumberOfLeftParentheses': 0,
                        'FieldAlias': 'DSM$DISCLOSURENUMBER',
                        'FilterOperator': 2,
                        'LeftFieldValue': 'disclosure',
                        'NumberOfRightParentheses': 0,
                        'SubsequentLogicalOperator': 0,
                        'IsFieldComparisonFilter': false,
                        'Field': {
                            'DataDictionaryId': 202,
                            'OriginalTableName': 'DISCLOSUREMASTERS',
                            'OriginalFieldName': 'DISCLOSURENUMBER',
                            'OriginalLabel': 'Disclosure Number',
                            'DefinedSize': 30,
                            'FieldAliasName': 'DSM$DISCLOSURENUMBER',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Disclosure Number',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 2,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'NumberOfLeftParentheses': 0,
                        'FieldAlias': 'DSM$DISCLOSURENUMBER',
                        'FilterOperator': 2,
                        'LeftFieldValue': 'Simple',
                        'NumberOfRightParentheses': 0,
                        'SubsequentLogicalOperator': 0,
                        'IsFieldComparisonFilter': false,
                        'Field': {
                            'DataDictionaryId': 202,
                            'OriginalTableName': 'DISCLOSUREMASTERS',
                            'OriginalFieldName': 'DISCLOSURENUMBER',
                            'OriginalLabel': 'Disclosure Number',
                            'DefinedSize': 30,
                            'FieldAliasName': 'DSM$DISCLOSURENUMBER',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Disclosure Number',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 2,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    }
                ],
                'ResultFields': [
                    {
                        'Display': 'Disclosure Number',
                        'Value': 'QRYDS_MASTERTITLE.DSM$DISCLOSURENUMBER',
                        'DataInfo': {
                            'DataDictionaryId': 202,
                            'OriginalTableName': 'DISCLOSUREMASTERS',
                            'OriginalFieldName': 'DISCLOSURENUMBER',
                            'OriginalLabel': 'Disclosure Number',
                            'DefinedSize': 30,
                            'FieldAliasName': 'DSM$DISCLOSURENUMBER',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Disclosure Number',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 2,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Create Date',
                        'Value': 'QRYDS_MASTERTITLE.DSM$CREATEDATE',
                        'DataInfo': {
                            'DataDictionaryId': 203,
                            'OriginalTableName': 'DISCLOSUREMASTERS',
                            'OriginalFieldName': 'CREATEDATE',
                            'OriginalLabel': 'Create Date',
                            'DefinedSize': 8,
                            'FieldAliasName': 'DSM$CREATEDATE',
                            'DataType': 'datetime',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Create Date',
                            'EditControlType': 'EDT0000005',
                            'IsPrimaryKey': false,
                            'ApplicationId': 2,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Create User',
                        'Value': 'QRYDS_MASTERTITLE.DSM$CREATEUSER',
                        'DataInfo': {
                            'DataDictionaryId': 182,
                            'OriginalTableName': 'DISCLOSUREMASTERS',
                            'OriginalFieldName': 'CREATEUSER',
                            'OriginalLabel': 'Create User',
                            'DefinedSize': 128,
                            'FieldAliasName': 'DSM$CREATEUSER',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Create User',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 2,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Record State',
                        'Value': 'QRYDS_MASTERTITLE.DSM$RECORDSTATE',
                        'DataInfo': {
                            'DataDictionaryId': 188,
                            'OriginalTableName': 'DISCLOSUREMASTERS',
                            'OriginalFieldName': 'RECORDSTATE',
                            'OriginalLabel': 'Record State',
                            'DefinedSize': 10,
                            'FieldAliasName': 'DSM$RECORDSTATE',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Record State',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 2,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Status',
                        'Value': 'QRYDS_MASTERTITLE.DSM$CUSTOMCODE#4',
                        'DataInfo': {
                            'DataDictionaryId': 166,
                            'OriginalTableName': 'DISCLOSUREMASTERS',
                            'OriginalFieldName': 'CUSTOMCODE#4',
                            'OriginalLabel': 'Status',
                            'DefinedSize': 10,
                            'FieldAliasName': 'DSM$CUSTOMCODE#4',
                            'DataType': 'nchar',
                            'LookupSource': 'CODES',
                            'LookupSourceType': 'SDP',
                            'CustomValue': 'Status',
                            'EditControlType': 'EDT0000003',
                            'IsPrimaryKey': false,
                            'ApplicationId': 2,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': true
                        }
                    },
                    {
                        'Display': 'Technology',
                        'Value': 'QRYDS_MASTERTITLE.DSM$CUSTOMCODE#1',
                        'DataInfo': {
                            'DataDictionaryId': 163,
                            'OriginalTableName': 'DISCLOSUREMASTERS',
                            'OriginalFieldName': 'CUSTOMCODE#1',
                            'OriginalLabel': 'Technology',
                            'DefinedSize': 10,
                            'FieldAliasName': 'DSM$CUSTOMCODE#1',
                            'DataType': 'nchar',
                            'LookupSource': 'CODES',
                            'LookupSourceType': 'TCP',
                            'CustomValue': 'Technology',
                            'EditControlType': 'EDT0000007',
                            'IsPrimaryKey': false,
                            'ApplicationId': 2,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': true,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': true
                        }
                    },
                    {
                        'Display': 'DISCLOSUREMASTERID',
                        'Value': 'QRYDS_MASTERTITLE.DSM$DISCLOSUREMASTERID',
                        'DataInfo': {
                            'DataDictionaryId': 193,
                            'OriginalTableName': 'DISCLOSUREMASTERS',
                            'OriginalFieldName': 'DISCLOSUREMASTERID',
                            'OriginalLabel': 'DISCLOSUREMASTERID',
                            'DefinedSize': 4,
                            'FieldAliasName': 'DSM$DISCLOSUREMASTERID',
                            'DataType': 'int',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'DISCLOSUREMASTERID',
                            'EditControlType': null,
                            'IsPrimaryKey': true,
                            'ApplicationId': 2,
                            'DbPrimaryKey': '1',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    }
                ],
                'OrderBy': [
                    {
                        'FieldAlias': 'DSM$CREATEDATE',
                        'SortDirection': 1
                    }
                ],
                'IpType': 2,
                'DisplayCaseImage': false,
                'DataModificationFormApplicable': true,
                'Source': 'QRYDS_MASTERTITLE',
                'QueryType': 0,
                'From': 'QRYDS_MASTERTITLE',
                'PlainTextFilter': null,
                'MasterIdFieldAliasName': 'DSM$DISCLOSUREMASTERID',
                'MasterTableName': 'DISCLOSUREMASTERS',
                'MasterIdFieldName': 'DISCLOSUREMASTERID'
            },
            'IpType': 2
        };
    }
};

export const generalip = {
    change: {},
    create(name: string, contentGroup: {id: number, name: string} =  null, queryGroupId: number = null) {
        return {
            'ResourceId': 0,
            'ResourceName': name,
            'Description': 'filter for TA records',
            'DisplayConfiguredName': name,
            'DisplayConfiguredDescription': 'filter for TA records',
            'SourceIpTypes': [
                {
                    'IpTypeId': 4,
                    'Name': 'GeneralIP1Masters',
                    'Description': 'GeneralIP1Masters',
                    'LicensedRecordCount': 1000,
                    'UsedRecordCount': 0,
                    'ElementName': 'GeneralIP1Masters'
                }
            ],
            'ContentGroups': contentGroup ? [
                {
                    'ContentGroupId': contentGroup.id,
                    'ContentGroupName': contentGroup.name ? contentGroup.name : 'Test Automation CG',
                    'IsActive': true,
                    'DisplaySettingId': 0,
                    'UpdateDate': '2019-07-26T12:00:26.227Z'
                }
            ] : [],
            'QueryGroupIds': queryGroupId ? [queryGroupId] : [],
            'QueryMetadata': {
                'FieldMetadata': null,
                'AdditionalFilters': [
                    {
                        'NumberOfLeftParentheses': 0,
                        'FieldAlias': 'G1M$KEYTEXT',
                        'FilterOperator': 2,
                        'LeftFieldValue': 'generalIp',
                        'NumberOfRightParentheses': 0,
                        'SubsequentLogicalOperator': 0,
                        'IsFieldComparisonFilter': false,
                        'Field': {
                            'DataDictionaryId': 528,
                            'OriginalTableName': 'GENERALIP1MASTERS',
                            'OriginalFieldName': 'KEYTEXT',
                            'OriginalLabel': 'Agreement Number',
                            'DefinedSize': 30,
                            'FieldAliasName': 'G1M$KEYTEXT',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Agreement Number',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 4,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'NumberOfLeftParentheses': 0,
                        'FieldAlias': 'G1M$KEYTEXT',
                        'FilterOperator': 2,
                        'LeftFieldValue': 'Simple',
                        'NumberOfRightParentheses': 0,
                        'SubsequentLogicalOperator': 0,
                        'IsFieldComparisonFilter': false,
                        'Field': {
                            'DataDictionaryId': 528,
                            'OriginalTableName': 'GENERALIP1MASTERS',
                            'OriginalFieldName': 'KEYTEXT',
                            'OriginalLabel': 'Agreement Number',
                            'DefinedSize': 30,
                            'FieldAliasName': 'G1M$KEYTEXT',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Agreement Number',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 4,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    }
                ],
                'ResultFields': [
                    {
                        'Display': 'Agreement Number',
                        'Value': 'QRYGIP1_MASTERS.G1M$KEYTEXT',
                        'DataInfo': {
                            'DataDictionaryId': 528,
                            'OriginalTableName': 'GENERALIP1MASTERS',
                            'OriginalFieldName': 'KEYTEXT',
                            'OriginalLabel': 'Agreement Number',
                            'DefinedSize': 30,
                            'FieldAliasName': 'G1M$KEYTEXT',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Agreement Number',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 4,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Create Date',
                        'Value': 'QRYGIP1_MASTERS.G1M$CREATEDATE',
                        'DataInfo': {
                            'DataDictionaryId': 536,
                            'OriginalTableName': 'GENERALIP1MASTERS',
                            'OriginalFieldName': 'CREATEDATE',
                            'OriginalLabel': 'Create Date',
                            'DefinedSize': 8,
                            'FieldAliasName': 'G1M$CREATEDATE',
                            'DataType': 'datetime',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Create Date',
                            'EditControlType': 'EDT0000005',
                            'IsPrimaryKey': false,
                            'ApplicationId': 4,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Create User',
                        'Value': 'QRYGIP1_MASTERS.G1M$CREATEUSER',
                        'DataInfo': {
                            'DataDictionaryId': 485,
                            'OriginalTableName': 'GENERALIP1MASTERS',
                            'OriginalFieldName': 'CREATEUSER',
                            'OriginalLabel': 'Create User',
                            'DefinedSize': 128,
                            'FieldAliasName': 'G1M$CREATEUSER',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Create User',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 4,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Status',
                        'Value': 'QRYGIP1_MASTERS.G1M$CUSTOMCODE#1',
                        'DataInfo': {
                            'DataDictionaryId': 434,
                            'OriginalTableName': 'GENERALIP1MASTERS',
                            'OriginalFieldName': 'CUSTOMCODE#1',
                            'OriginalLabel': 'Status',
                            'DefinedSize': 10,
                            'FieldAliasName': 'G1M$CUSTOMCODE#1',
                            'DataType': 'nchar',
                            'LookupSource': 'CODES',
                            'LookupSourceType': 'ST1',
                            'CustomValue': 'Status',
                            'EditControlType': 'EDT0000003',
                            'IsPrimaryKey': false,
                            'ApplicationId': 4,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': true
                        }
                    },
                    {
                        'Display': 'Sensitive',
                        'Value': 'QRYGIP1_MASTERS.G1M$CUSTOMTEXT#8',
                        'DataInfo': {
                            'DataDictionaryId': 503,
                            'OriginalTableName': 'GENERALIP1MASTERS',
                            'OriginalFieldName': 'CUSTOMTEXT#8',
                            'OriginalLabel': 'Sensitive',
                            'DefinedSize': 1,
                            'FieldAliasName': 'G1M$CUSTOMTEXT#8',
                            'DataType': 'BITTYPE',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Sensitive',
                            'EditControlType': 'EDT0000006',
                            'IsPrimaryKey': false,
                            'ApplicationId': 4,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Agreement Type',
                        'Value': 'QRYGIP1_MASTERS.G1M$KEYCODE#1',
                        'DataInfo': {
                            'DataDictionaryId': 443,
                            'OriginalTableName': 'GENERALIP1MASTERS',
                            'OriginalFieldName': 'KEYCODE#1',
                            'OriginalLabel': 'Agreement Type',
                            'DefinedSize': 10,
                            'FieldAliasName': 'G1M$KEYCODE#1',
                            'DataType': 'nchar',
                            'LookupSource': 'CODES',
                            'LookupSourceType': 'CS1',
                            'CustomValue': 'Agreement Type',
                            'EditControlType': 'EDT0000003',
                            'IsPrimaryKey': false,
                            'ApplicationId': 4,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': true
                        }
                    },
                    {
                        'Display': 'GENERALIP1MASTERID',
                        'Value': 'QRYGIP1_MASTERS.G1M$GENERALIP1MASTERID',
                        'DataInfo': {
                            'DataDictionaryId': 478,
                            'OriginalTableName': 'GENERALIP1MASTERS',
                            'OriginalFieldName': 'GENERALIP1MASTERID',
                            'OriginalLabel': 'GENERALIP1MASTERID',
                            'DefinedSize': 4,
                            'FieldAliasName': 'G1M$GENERALIP1MASTERID',
                            'DataType': 'int',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'GENERALIP1MASTERID',
                            'EditControlType': null,
                            'IsPrimaryKey': true,
                            'ApplicationId': 4,
                            'DbPrimaryKey': '1',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    }
                ],
                'OrderBy': [
                    {
                        'FieldAlias': 'G1M$CREATEDATE',
                        'SortDirection': 1
                    }
                ],
                'IpType': 4,
                'DisplayCaseImage': false,
                'DataModificationFormApplicable': true,
                'Source': 'QRYGIP1_MASTERS',
                'QueryType': 0,
                'From': 'QRYGIP1_MASTERS',
                'PlainTextFilter': null,
                'MasterIdFieldAliasName': 'G1M$GENERALIP1MASTERID',
                'MasterTableName': 'GENERALIP1MASTERS',
                'MasterIdFieldName': 'GENERALIP1MASTERID'
            },
            'IpType': 4
        };
    }
};

export const party = {
    change: {},
    create(name: string, contentGroup: {id: number, name: string} =  null) {
        return {
            'ResourceId': 0,
            'ResourceName': name,
            'Description': 'filter for TA records',
            'DisplayConfiguredName': name,
            'DisplayConfiguredDescription': 'filter for TA records',
            'SourceIpTypes': [
                {
                    'IpTypeId': 51,
                    'Name': 'Parties',
                    'Description': 'Parties',
                    'LicensedRecordCount': 0,
                    'UsedRecordCount': 0,
                    'ElementName': 'Parties'
                }
            ],
            'ContentGroups': contentGroup ? [
                {
                    'ContentGroupId': contentGroup.id,
                    'ContentGroupName': contentGroup.name ? contentGroup.name : 'Test Automation CG',
                    'IsActive': true,
                    'DisplaySettingId': 0,
                    'UpdateDate': '2019-07-26T12:00:26.227Z'
                }
            ] : [],
            'QueryGroupIds': [],
            'QueryMetadata': {
                'FieldMetadata': null,
                'AdditionalFilters': [],
                'ResultFields': [
                    {
                        'Display': 'Party',
                        'Value': 'QRYAD_PARTIES.PD$PARTY',
                        'DataInfo': {
                            'DataDictionaryId': 4660,
                            'OriginalTableName': 'PARTYDETAILS',
                            'OriginalFieldName': 'PARTY',
                            'OriginalLabel': 'Party',
                            'DefinedSize': 80,
                            'FieldAliasName': 'PD$PARTY',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Party',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 51,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'Create User',
                        'Value': 'QRYAD_PARTIES.PA$CREATEUSER',
                        'DataInfo': {
                            'DataDictionaryId': 4629,
                            'OriginalTableName': 'PARTIES',
                            'OriginalFieldName': 'CREATEUSER',
                            'OriginalLabel': 'Create User',
                            'DefinedSize': 128,
                            'FieldAliasName': 'PA$CREATEUSER',
                            'DataType': 'nvarchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'Create User',
                            'EditControlType': 'EDT0000002',
                            'IsPrimaryKey': false,
                            'ApplicationId': 51,
                            'DbPrimaryKey': '0',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    },
                    {
                        'Display': 'PARTYID',
                        'Value': 'QRYAD_PARTIES.PA$PARTYID',
                        'DataInfo': {
                            'DataDictionaryId': 4630,
                            'OriginalTableName': 'PARTIES',
                            'OriginalFieldName': 'PARTYID',
                            'OriginalLabel': 'PARTYID',
                            'DefinedSize': 10,
                            'FieldAliasName': 'PA$PARTYID',
                            'DataType': 'nchar',
                            'LookupSource': null,
                            'LookupSourceType': null,
                            'CustomValue': 'PARTYID',
                            'EditControlType': null,
                            'IsPrimaryKey': true,
                            'ApplicationId': 51,
                            'DbPrimaryKey': '1',
                            'IsSortable': true,
                            'IsDatadictionaryItem': false,
                            'IsLargeListLookupField': false,
                            'IsHierarchyField': false,
                            'IsCountriesLookup': false,
                            'IsCodesLookup': false
                        }
                    }
                ],
                'OrderBy': [],
                'IpType': 51,
                'DisplayCaseImage': false,
                'DataModificationFormApplicable': false,
                'Source': 'QRYAD_PARTIES',
                'QueryType': 3,
                'From': 'QRYAD_PARTIES',
                'PlainTextFilter': null,
                'MasterIdFieldAliasName': 'PA$PARTYDETAILID',
                'MasterTableName': 'PARTYDETAILS',
                'MasterIdFieldName': 'PARTYDETAILID'
            },
            'IpType': 51
        };
    }
};
