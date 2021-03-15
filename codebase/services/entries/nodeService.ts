const nodeService = {
    name: 'NodeService',

    getAllLastNodesUnderPath(elementList, elementPath: string, searchCriteriaNodeName: string, childrenNodeName: string): any {
        let childElements = elementList;
        let element;

        let pathArray = elementPath.split('>');
        pathArray.forEach((item) => {
            element = childElements.find((x) => x[searchCriteriaNodeName].trim() === item.trim());
            childElements = element[childrenNodeName];
        });

        if (!(childElements && childElements.length)) {
            return [element];
        }
        return this.getAllLastNodes(childElements, childrenNodeName);
    },

    getCurrentNode(elementList, elementPath: string, searchCriteriaNodeName: string, childrenNodeName: string): any {
        let childElements = elementList;
        let element;

        let pathArray = elementPath.split('>');
        pathArray.forEach((item) => {
            element = childElements.find((x) => x[searchCriteriaNodeName] === item);
            childElements = element[childrenNodeName];
        });
        return element;
    },

    getAllLastNodesUnderPathWithParents(elementList, elementPath: string, searchCriteriaNodeName: string, childrenNodeName: string): any[] {
        let childElements = elementList;
        let element;

        let pathArray = elementPath.split('>');
        pathArray.forEach((item) => {
            element = childElements.find((x) => x[searchCriteriaNodeName] === item);
            childElements = element[childrenNodeName];
        });

        if (!(childElements && childElements.length)) {
            return [element];
        }
        return [element, ...this.getAllNodesWithParents(childElements, childrenNodeName)];
    },

    getAllNodesWithParents(elementList, childrenNodeName: string): any[] {
        let list = [];
        elementList.forEach((x) => {
            list.push(x);
            if (x[childrenNodeName] && x[childrenNodeName].length) {
                list = list.concat(this.getAllLastNodes(x[childrenNodeName], childrenNodeName));
            }
        });
        return list;
    },

    getAllLastNodes(elementList, childrenNodeName: string): any[] {
        let list = [];
        elementList.forEach((x) => {
            if (!(x[childrenNodeName] && x[childrenNodeName].length)) {
                list.push(x);
            } else {
                list = list.concat(this.getAllLastNodes(x[childrenNodeName], childrenNodeName));
            }
        });
        return list;
    }

};

export default nodeService;
