import {
    Text,
    Panel,
    Button,
    colors,
    styled,
    ManagedTable,
    DetailSidebar,
    FlipperPlugin,
    ManagedDataInspector,
} from 'flipper';

const columns = {
    key: {
        value: 'Key',
    },
    value: {
        value: 'Value',
    },
};

const columnSizes = {
    key: '20%',
    value: 'flex',
};

class AsyncStorage extends FlipperPlugin {
    constructor(props) {
        super(props);
    }
    state = {
        selectedElementId: '',
    };

    static defaultPersistedState = {
        data: [],
        selectedElement: null,
    };

    static persistedStateReducer(persistedState, method, payload) {
        switch (method) {
            case 'newElement': {
                return {
                    data: this.addNewElement(persistedState.data, payload),
                };
            }
        }
    }

    static addNewElement = (data, newElement) => {
        const index = data.findIndex(
            (current) => current.key === newElement.key
        );
        if (index === -1) {
            data.push(newElement);
            return data;
        }
        data[index] = newElement;
        return data;
    };

    onRowHighlighted = ([selectedRowId]) => {
        const selectedElement = this.props.persistedState.data.find(
            (el) => el.id === selectedRowId
        );
        this.props.setPersistedState({ selectedElement });
    };

    sendMeData = () => {
        this.client.call('sendMeData').then(() => this.setState({}));
    };

    buildRows() {
        const { data } = this.props.persistedState;
        return data.map((row) => {
            return {
                columns: {
                    key: {
                        value: <Text>{row.key}</Text>,
                        filterValue: row.key,
                    },
                    value: {
                        value: <Text>{JSON.stringify(row.value)}</Text>,
                        filterValue: JSON.stringify(row.value),
                    },
                },
                key: row.id,
                copyText: JSON.stringify(row),
                filterValue: `${row.key} ${JSON.stringify(row.value)}`,
            };
        });
    }

    render() {
        const {
            persistedState: { data, selectedElement },
        } = this.props;
        if (!data.length) {
            return (
                <AsyncStorage.Container>
                    <Button type="primary" onClick={this.sendMeData}>
                        Get Data
                    </Button>
                </AsyncStorage.Container>
            );
        }
        return (
            <>
                <ManagedTable
                    floating={false}
                    multiline={true}
                    columns={columns}
                    stickyBottom={true}
                    multiHighlight={false}
                    rows={this.buildRows()}
                    columnSizes={columnSizes}
                    onRowHighlighted={this.onRowHighlighted}
                    actions
                />
                <DetailSidebar>
                    <Panel floating={false} heading={'Data'}>
                        <ManagedDataInspector
                            data={!selectedElement ? data : selectedElement}
                            expandRoot={true}
                        />
                    </Panel>
                </DetailSidebar>
            </>
        );
    }

    static Container = styled.div({
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: colors.macOSTitleBarBackgroundBlur,
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        overflow: 'scroll',
    });
}

export default AsyncStorage;
