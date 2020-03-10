// import * as LongText from 'front-end/lib/components/form-field/long-text';
import { Route } from 'front-end/lib/app/types';
import * as FormField from 'front-end/lib/components/form-field';
import * as DateField from 'front-end/lib/components/form-field/date';
import * as NumberField from 'front-end/lib/components/form-field/number';
import { Dispatch, GlobalComponentMsg, immutable, Immutable, Init, mapComponentDispatch, Update, updateComponentChild, View, ViewElementChildren } from 'front-end/lib/framework';
import Icon from 'front-end/lib/views/icon';
// import Link, { iconLinkSymbol, leftPlacement } from 'front-end/lib/views/link';
import React from 'react';
import { Col, Row } from 'reactstrap';
import { adt, ADT } from 'shared/lib/types';

export interface Capability {
  name: string;
  pt: boolean;
  checked: boolean;
}

interface PhaseState {
  title: string;
  description: string;

  commonDeliverables: string[];
  startDate: Immutable<DateField.State>;
  completionDate: Immutable<DateField.State>;
  maxBudget: Immutable<NumberField.State>;

  capabilities: Capability[];

  collapsed: boolean;
}

interface AccordionProps {
  title: string;
  collapsed: boolean;
  children: ViewElementChildren;
}

export async function InitPhase(title: string, description: string, commonDeliverables: string[]): Promise<PhaseState> {
  const capabilities = [
    {
      name: 'Agile Coaching',
      pt: false,
      checked: false
    },
    {
      name: 'Delivery Management',
      pt: false,
      checked: false
    },
    {
      name: 'Frontend Development',
      pt: false,
      checked: false
    },
    {
      name: 'Technical Architecture',
      pt: false,
      checked: false
    },
    {
      name: 'User Research',
      pt: false,
      checked: false
    },
    {
      name: 'Backend Development',
      pt: false,
      checked: false
    },
    {
      name: 'DevOps Engineering',
      pt: false,
      checked: false
    },
    {
      name: 'Security Engineering',
      pt: false,
      checked: false
    },
    {
      name: 'User Experience Design',
      pt: false,
      checked: false
    }
  ];

  return {
    title,
    description,
    commonDeliverables,
    capabilities,
    collapsed: false,
    startDate: immutable(await DateField.init({
      errors: [],
      child: {
        value: null,
        id: ''
      }
    })),

    completionDate: immutable(await DateField.init({
      errors: [],
      child: {
        value: null,
        id: ''
      }
    })),

    maxBudget: immutable(await NumberField.init({
      errors: [],
      child: {
        value: null,
        id: ''
      }
    }))
  };
}

type Params = {};

export interface State extends Params {
  phases: PhaseState[];
}

export type InnerMsg =
  ADT<'toggleCollapsed',   number>                                                    |
  ADT<'toggleCapChecked',  { phaseIndex: number; capIndex: number; }>                 |
  ADT<'setPtChecked',      { phaseIndex: number; capIndex: number; value: boolean; }> |
  ADT<'startDate',         { childMsg: DateField.Msg; phaseIndex: number }>           |
  ADT<'completionDate',    { childMsg: DateField.Msg; phaseIndex: number }>           |
  ADT<'maxBudget',         { childMsg: NumberField.Msg; phaseIndex: number }>;

export type Msg = GlobalComponentMsg<InnerMsg, Route>;

export const init: Init<Params, State> = async (initParams) => {
  return {
    phases: [
      await InitPhase(
        'Inception',
        'During Inception you will take your business goals and research findings and explore the potential value that a new digital product can bring. You will then determine the features of a Minimum Viable Product (MVP) and the scope for an Alpha release.',
        ['Happy stakeholders with a shared vision for your digital product', 'A product backlog for the Alpha release']
      ),
      await InitPhase(
        'Proof of Concept',
        'During Proof of Concept you will make your value propositions tangible so that they can be validated. You will begin developing the core features of your product that were scoped out during the Inception phase, working towards the Alpha release!',
        ['Alpha release of the product', 'a build/buy/licence decision', 'Product Roadmap', 'Resourcing plan for Implementation']
      ),
      await InitPhase(
        'Implementation',
        'As you reach the Implementation phase you should be fully invested in your new digital product and plan for its continuous improvement. Next, you will need to carefully architect and automate the delivery pipeline for stability and continuous deployment.',
        ['Delivery of the function components in the Product Roadmap']
      )
    ]
  };

};

export const update: Update<State, Msg> = ({ state, msg }) => {

  switch (msg.tag) {

    case 'setPtChecked':
      const phaseIndex2 = msg.value.phaseIndex; // Named phaseIndex2 because the compiler doesn't like phaseIndex below being shadowed
      const capIndex2 = msg.value.capIndex;
      state.phases[phaseIndex2].capabilities[capIndex2].pt = msg.value.value;
      return [state];

    case 'toggleCapChecked':
      const phaseIndex1 = msg.value.phaseIndex; // Named phaseIndex1 because the compiler doesn't like phaseIndex below being shadowed
      const capIndex = msg.value.capIndex;
      state.phases[phaseIndex1].capabilities[capIndex].checked = !state.phases[phaseIndex1].capabilities[capIndex].checked;
      return [state];

    case 'toggleCollapsed':
      const phaseIndex = msg.value;
      state.phases[phaseIndex].collapsed = !state.phases[phaseIndex].collapsed;
      return [state];

    case 'startDate':
      return updateComponentChild({
        state,
        childStatePath: ['phases', `${msg.value.phaseIndex}`, 'startDate'],
        childUpdate: DateField.update,
        childMsg: msg.value.childMsg,
        mapChildMsg: (value) => adt('startDate', { childMsg: value, phaseIndex: msg.value.phaseIndex } )
      });

    case 'completionDate':
      return updateComponentChild({
        state,
        childStatePath: ['phases', `${msg.value.phaseIndex}`, 'completionDate'],
        childUpdate: DateField.update,
        childMsg: msg.value.childMsg,
        mapChildMsg: (value) => adt('completionDate', { childMsg: value, phaseIndex: msg.value.phaseIndex } )
      });

    case 'maxBudget':
      return updateComponentChild({
        state,
        childStatePath: ['phases', `${msg.value.phaseIndex}`, 'maxBudget'],
        childUpdate: NumberField.update,
        childMsg: msg.value.childMsg,
        mapChildMsg: (value) => adt('maxBudget', { childMsg: value, phaseIndex: msg.value.phaseIndex } )
      });

    default:
      return [state];
  }
};

interface Values {
  startDate: DateField.Value;
  completionDate: DateField.Value;
  maxBudget: NumberField.Value;
}

export function getValues(state: Immutable<State>, phaseIndex: number): Values {
  return {
    startDate: FormField.getValue(state.phases[phaseIndex].startDate),
    completionDate: FormField.getValue(state.phases[phaseIndex].completionDate),
    maxBudget: FormField.getValue(state.phases[phaseIndex].maxBudget)
  };
}

// import { ErrorTypeFrom } from 'shared/lib/validation';
// type Errors = ErrorTypeFrom<Values>;
//
// export function setErrors(state: Immutable<State>, errors: Errors): Immutable<State> {
//   if (errors) {
//     return state
//     .update('phases.startDate', s => FormField.setErrors(s, errors.startDate || []))
//     .update('completionDate', s => FormField.setErrors(s, errors.completionDate || []))
//     .update('maxBudget', s => FormField.setErrors(s, errors.maxBudget || []));
//   } else {
//     return state;
//   }
// }

type PublicProps = {
  state: State;
  dispatch: Dispatch<Msg>;

  disabled: boolean;
};

type ChildProps = {
  state: State;
  dispatch: Dispatch<Msg>;

  disabled: boolean;
  phaseIndex: number;
};

const StartingPhaseView: View<PublicProps> = ({ state, dispatch, disabled }) => {
  return (
    <div className='pb-5 mb-3 border-bottom' >
      Starting Phase select goes here!
    </div>
  );
};

const TeamCapabilitiesView: View<ChildProps> = (props) => {
  const { state, dispatch } = props;
  const phaseIndex = props.phaseIndex;
  return (
    <Row>
      <Col xs='12'>
        <h4>Team Capabilities</h4>
        <p>Select the capabilities that you will need during this phase and
          indicate whether you expect the need to be for part-time or
          full-time.</p>
      </Col>
      {
        state.phases[phaseIndex].capabilities.map((cap, capIndex) =>
          <Col key={capIndex} xs='6' onClick={ () => { dispatch(adt('toggleCapChecked', {phaseIndex, capIndex})); } }>
            <div className='d-flex justify-content-between p-3 border'>
              <div >
                <input type='checkbox' checked={cap.checked} onChange={() => null}/>
                <span className='pl-2'>{cap.name}</span>
              </div>
              {
                cap.checked ?
                <div>
                  <strong className={`p-1
                                    border
                                    rounded-left
                                    font-size-very-small
                                    ${cap.pt ? 'bg-purple-light text-white' : '' }`}  // TODO(tags: design): light-purple color for this one?
                    onClick={ (e) => { dispatch(adt('setPtChecked', {phaseIndex, capIndex, value: true})); e.preventDefault(); e.stopPropagation(); } }
                  > P/T
                  </strong>

                  <strong className={`p-1
                                    border
                                    rounded-right
                                    font-size-very-small
                                    ${cap.pt ? '' : 'bg-purple text-white'}`}
                    onClick={ (e) => { dispatch(adt('setPtChecked', {phaseIndex, capIndex, value: false})); e.preventDefault(); e.stopPropagation(); } }
                  > F/T
                  </strong>
                </div>
                :
                null
              }
            </div>
          </Col>
        )
      }
    </Row>
  );
};

const PhaseDetailsView: View<PhaseState & ChildProps> = ({ state, dispatch, disabled, phaseIndex}) => {
  return (
    <Row className='py-4'>
      <Col sm='12'>
        <h4>Details</h4>
      </Col>

      <Col md='6' sm='12'>
        <DateField.view
          required
          extraChildProps={{}}
          label='Phase start date'
          state={state.phases[phaseIndex].startDate}
          disabled={disabled}
          dispatch={mapComponentDispatch(dispatch, value => adt('startDate' as const, { childMsg: value, phaseIndex } ))} />
      </Col>

      <Col md='6' sm='12'>
        <DateField.view
          extraChildProps={{}}
          label='Phase completion date'
          state={state.phases[phaseIndex].completionDate}
          disabled={disabled}
          dispatch={mapComponentDispatch(dispatch, value => adt('completionDate' as const, { childMsg: value, phaseIndex } ))} />
      </Col>

      <Col sm='8'>
        <NumberField.view
          required
          extraChildProps={{ prefix: '$' }}
          placeholder='0.00'
          label='Phase max budget'
          state={state.phases[phaseIndex].maxBudget}
          disabled={disabled}
          dispatch={mapComponentDispatch(dispatch, value => adt('maxBudget' as const, { childMsg: value, phaseIndex } ))} />
      </Col>

    </Row>
  );
};

export const AccordionView: View<Omit<ChildProps & AccordionProps, 'state' | 'disabled'>> = (props) => {
  const headerColor = 'blue-dark';
  return (
    <div className='pb-4 pt-3'>

      <div className='d-flex align-items-center justify-content-between' onClick={ () => props.dispatch(adt('toggleCollapsed', props.phaseIndex)) }>
        <div>
          <Icon color={headerColor} name='paperclip' />
          <span className={`text-${headerColor} pl-3 h3`}>{props.title}</span>
        </div>
        {
          props.collapsed ?
          <Icon color={headerColor} className='justify-self-end' name='paperclip' /> :
          <Icon color={headerColor} className='justify-self-end' name='save' />
        }
      </div>

      <div className={`${ props.collapsed ? 'd-none' : null }`}>
        {props.children}
      </div>

    </div>
  );
};

const PhaseView: View<PhaseState & ChildProps> = (state) => {
  return (
    <div>
      <div className='pt-3'>
        <p>{state.description}</p>
      </div>

      <div>
        <Icon name='paperclip' />
        <span className='pl-2 h6'>Common Deliverables</span>
      </div>

      <div>
        <ul>
          {
            state.commonDeliverables.map( (deliverable, index) => {
              return <li key={index}>{deliverable}</li>;
            })
          }
        </ul>

    <PhaseDetailsView
      phaseIndex={state.phaseIndex}
      {...state} />

        <TeamCapabilitiesView
          phaseIndex={state.phaseIndex}
          {...state} />

      </div>
    </div>
  );
};

const PhaseAccordionView: View<PhaseState & ChildProps> = (state) => {
  const phaseIndex = state.phaseIndex;

  return (
    <AccordionView
      phaseIndex={phaseIndex}
      title={state.title}
      collapsed={state.collapsed}
      dispatch={state.dispatch}
    >
      <PhaseView phaseIndex={phaseIndex} {...state} />
    </AccordionView>
  );
};

export const view: View<PublicProps> = (props) => {
  return (
    <div>
      <StartingPhaseView {...props} />

      { props.state.phases.map( (phase, index) => {
          return (
            <PhaseAccordionView
              key={index}
              phaseIndex={index}
              dispatch={props.dispatch}
              state={props.state}
              disabled={false}
              {...phase}
            />
          );
        })
      }

    </div>
  );
};
