jest.mock("../../../../../utils/utils");

import { checkRefRight } from "../../../../../utils/utils";
import { mapStateToProps, mapDispatchToProps, Targets } from "../Targets";

describe("<Targets />", () => {
    let props;

    beforeEach(() => {
        props = {
            canModify: true,
            targets: [{ name: "foo" }],
            onRemove: jest.fn(),
            refId: "bar"
        };
    });

    it("should render when [canModify=true]", () => {
        const wrapper = shallow(<Targets {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when [canModify=false]", () => {
        props.canModify = false;
        const wrapper = shallow(<Targets {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("showAdd() should update state", () => {
        const wrapper = shallow(<Targets {...props} />);
        wrapper.find("a").simulate("click");
        expect(wrapper.state()).toEqual({ showAdd: true, showEdit: false });
    });

    it("showEdit() should update state", () => {
        const wrapper = shallow(<Targets {...props} />);
        wrapper.find("TargetItem").prop("onEdit")("foo");
        expect(wrapper.state()).toEqual({
            activeName: "foo",
            showAdd: false,
            showEdit: true
        });
    });

    it("handleRemove() should call onRemove()", () => {
        const wrapper = shallow(<Targets {...props} />);
        wrapper.find("TargetItem").prop("onRemove")("foo");
        expect(props.onRemove).toHaveBeenCalledWith("bar", { targets: [] });
    });
});

describe("mapStateToProps()", () => {
    const state = {
        references: {
            detail: {
                id: "baz",
                targets: [
                    { name: "foo", description: "bar", required: false },
                    { name: "Foo", description: "Bar", required: true }
                ]
            }
        }
    };

    it("should return props when user can modify ref", () => {
        checkRefRight.mockReturnValue(true);

        const result = mapStateToProps(state);

        expect(result).toEqual({
            canModify: true,
            refId: "baz",
            targets: [
                { name: "foo", description: "bar", required: false },
                { name: "Foo", description: "Bar", required: true }
            ]
        });
    });

    it("should return props when user cannnot modify ref", () => {
        checkRefRight.mockReturnValue(false);

        const result = mapStateToProps(state);

        expect(result).toEqual({
            canModify: false,
            refId: "baz",
            targets: [
                { name: "foo", description: "bar", required: false },
                { name: "Foo", description: "Bar", required: true }
            ]
        });
    });
});

describe("mapDispatchToProps()", () => {
    it("should return onRemove in props ", () => {
        const dispatch = jest.fn();
        const props = mapDispatchToProps(dispatch);
        props.onRemove("foo", "bar");
        expect(dispatch).toHaveBeenCalledWith({ refId: "foo", update: "bar", type: "EDIT_REFERENCE_REQUESTED" });
    });
});