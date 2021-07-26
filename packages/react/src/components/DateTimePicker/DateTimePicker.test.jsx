import React from 'react';
import { mount } from 'enzyme';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom/extend-expect';
import dayjs from '../../utils/dayjs';
import {
  INTERVAL_VALUES,
  RELATIVE_VALUES,
  PRESET_VALUES,
  PICKER_KINDS,
} from '../../constants/DateConstants';

import DateTimePicker from './DateTimePicker';
import { defaultAbsoluteValue, defaultRelativeValue } from './DateTimePicker.story';

const defaultPresets = [
  ...PRESET_VALUES,
  {
    label: 'Last 70 minutes',
    offset: 70,
  },
];

const dateTimePickerProps = {
  onCancel: jest.fn(),
  onApply: jest.fn(),
};

const i18n = {
  presetLabels: ['Last 30 minutes', 'Missed in translation'],
  intervalLabels: ['minutes', 'Missed in translation'],
  relativeLabels: ['Missed in translation'],
};

describe('DateTimePicker', () => {
  afterEach(() => {
    console.error.mockClear();
  });

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  it('should not blow up if correct object is passed as default value', () => {
    mount(
      <DateTimePicker
        {...dateTimePickerProps}
        presets={[
          {
            label: 'Last 30 minutes',
            offset: 30,
          },
          {
            label: 'Last 1 hour',
            offset: 60,
          },
        ]}
        defaultValue={{
          timeRangeKind: PICKER_KINDS.PRESET,
          // test not having id
          timeRangeValue: {
            label: 'Last 30 minutes',
            offset: 30,
          },
        }}
      />
    );
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('should blow up if wrong combo of timeRangeKind and timeRangeValue is passed for defaultValue', () => {
    mount(
      <DateTimePicker
        {...dateTimePickerProps}
        preset={defaultPresets}
        defaultValue={{
          timeRangeKind: 'some other string',
          timeRangeValue: PRESET_VALUES[1],
        }}
      />
    );
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should have the first preset as value', () => {
    render(<DateTimePicker {...dateTimePickerProps} i18n={i18n} />);
    expect(screen.getByText(PRESET_VALUES[0].label)).toBeVisible();
  });

  it('should change to another preset value when clicked', () => {
    render(
      <DateTimePicker
        {...dateTimePickerProps}
        presets={[
          {
            label: 'Last 30 minutes',
            offset: 30,
          },
          {
            label: 'Last 1 hour',
            offset: 60,
          },
        ]}
      />
    );
    // open the dropdown
    // the first element is the button. the second element is the svg
    userEvent.click(screen.getAllByLabelText('Calendar')[0]);
    // select last 1 hour
    userEvent.click(screen.getByText(/Last 1 hour/));
    // check for the selected text
    expect(screen.getAllByText(/Last 1 hour/)).toHaveLength(2);
  });

  it('should show the user defined tooltip for preset', () => {
    render(
      <DateTimePicker
        {...dateTimePickerProps}
        renderPresetTooltipText={() => 'User tooltip'}
        preset={defaultPresets}
      />
    );
    expect(screen.getByText('User tooltip')).toBeInTheDocument();
  });

  it('should call onApply', () => {
    render(<DateTimePicker {...dateTimePickerProps} preset={defaultPresets} />);
    userEvent.click(screen.getAllByLabelText('Calendar')[0]);
    userEvent.click(screen.getByText('Apply'));
    expect(dateTimePickerProps.onApply).toHaveBeenCalled();
  });

  it('onCancel should be called', () => {
    render(<DateTimePicker {...dateTimePickerProps} />);
    userEvent.click(screen.getAllByLabelText('Calendar')[0]);
    userEvent.click(screen.getByText('Cancel'));
    expect(dateTimePickerProps.onCancel).toHaveBeenCalled();
  });

  it('should render with a predefined preset', () => {
    render(
      <DateTimePicker
        {...dateTimePickerProps}
        defaultValue={{
          timeRangeKind: PICKER_KINDS.PRESET,
          timeRangeValue: PRESET_VALUES[1],
        }}
      />
    );
    expect(screen.getByText(PRESET_VALUES[1].label)).toBeVisible();
  });

  it('should render with a predefined relative range', () => {
    render(<DateTimePicker {...dateTimePickerProps} defaultValue={defaultRelativeValue} />);

    // default value is 20 minutes relative to today at 13:30

    // first open the menu
    userEvent.click(screen.getAllByLabelText('Calendar')[0]);
    // change the last interval to days, meaning 20 days relative to today at 13:30
    fireEvent.change(screen.getAllByLabelText('Select')[0], {
      target: { value: INTERVAL_VALUES.DAYS },
    });
    // change the relative to yesterady, meaning 20 days relative to yesterday at 13:30
    fireEvent.change(screen.getAllByLabelText('Select')[1], {
      target: { value: RELATIVE_VALUES.YESTERDAY },
    });

    const yesterday = dayjs().subtract(1, 'day');
    const from = yesterday.subtract(20, 'day');

    // expect 20 day range relative to yesterday at 13:30
    expect(
      screen.getByText(
        `${from.format('YYYY-MM-DD')} 13:30 to ${yesterday.format('YYYY-MM-DD')} 13:30`
      )
    ).toBeVisible();

    userEvent.click(screen.getByLabelText('Increment hours'));
    // expect 20 day range relative to yesterday at 14:30
    expect(
      screen.getByText(
        `${from.format('YYYY-MM-DD')} 14:30 to ${yesterday.format('YYYY-MM-DD')} 14:30`
      )
    ).toBeVisible();

    userEvent.click(screen.getByLabelText('Increment hours'));
    // expect 20 day range relative to yesterday at 15:30
    expect(
      screen.getByText(
        `${from.format('YYYY-MM-DD')} 15:30 to ${yesterday.format('YYYY-MM-DD')} 15:30`
      )
    ).toBeVisible();

    userEvent.click(screen.getByText('Apply'));
    expect(dateTimePickerProps.onApply).toHaveBeenCalled();
    // calling twice for some reason
    // expect(dateTimePickerProps.onApply).toHaveBeenCalledWith({
    //   timeRangeKind: 'RELATIVE',
    //   timeRangeValue: {
    //     end: '2018-09-20T20:30:34.000Z',
    //     lastInterval: 'DAYS',
    //     lastNumber: 20,
    //     relativeToTime: '15:30',
    //     relativeToWhen: 'YESTERDAY',
    //     start: '2018-08-31T20:30:34.000Z',
    //   },
    // });
  });

  it('should render with a predefined absolute range', () => {
    render(<DateTimePicker {...dateTimePickerProps} defaultValue={defaultAbsoluteValue} />);

    // default value starts at   '2020-04-01' at 12:34 to 2020-04-06 at 10:49
    expect(screen.getByText('2020-04-01 12:34 to 2020-04-06 10:49')).toBeVisible();

    // first open the menu
    userEvent.click(screen.getAllByLabelText('Calendar')[0]);

    userEvent.click(screen.getAllByLabelText('Increment hours')[0]);
    expect(screen.getByText('2020-04-01 13:34 to 2020-04-06 10:49')).toBeVisible();

    userEvent.click(screen.getAllByLabelText('Increment hours')[1]);
    expect(screen.getByText('2020-04-01 13:34 to 2020-04-06 11:49')).toBeVisible();

    userEvent.click(screen.getByText('Apply'));
    expect(dateTimePickerProps.onApply).toHaveBeenCalled();
  });

  it('should go back to presets when cancel button is picked on Absolute screen', () => {
    render(<DateTimePicker {...dateTimePickerProps} defaultValue={defaultAbsoluteValue} />);

    // first open the menu
    userEvent.click(screen.getAllByLabelText('Calendar')[0]);
    userEvent.click(screen.getByText(/Back/));
    expect(screen.getByText(/Custom Range/)).toBeInTheDocument();
  });

  it('should switch from relative to absolute and then to preset', () => {
    render(<DateTimePicker {...dateTimePickerProps} defaultValue={defaultRelativeValue} />);

    // first open the menu
    userEvent.click(screen.getAllByLabelText('Calendar')[0]);

    // There should only be one on the relative page
    expect(screen.getAllByTitle(/Increment hours/).length).toEqual(1);

    userEvent.click(screen.getByTestId('date-time-picker__field'));
    userEvent.click(screen.getAllByText('Absolute')[0]);

    // There should be two on the Absolute page
    expect(screen.getAllByTitle(/Increment hours/).length).toEqual(2);

    userEvent.click(screen.getAllByText('Absolute')[0]);
  });

  it('should not show the relative option', () => {
    const wrapper = mount(
      <DateTimePicker
        {...dateTimePickerProps}
        defaultValue={defaultAbsoluteValue}
        showRelativeOption={false}
        hasTimeInput={false}
      />
    );
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    expect(wrapper.find('.bx--radio-button')).toHaveLength(0);
  });

  // https://github.com/IBM/carbon-addons-iot-react/issues/1179
  it('should not show the relative option with preset as default value', () => {
    const wrapper = mount(
      <DateTimePicker
        {...dateTimePickerProps}
        defaultValue={PRESET_VALUES[1]}
        showRelativeOption={false}
      />
    );
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    expect(wrapper.find('.bx--radio-button')).toHaveLength(0);
  });

  it('should set the value relative to yesterday', () => {
    render(
      <DateTimePicker
        {...dateTimePickerProps}
        intervals={[
          {
            label: 'minutes',
            value: INTERVAL_VALUES.MINUTES,
          },
        ]}
        relatives={[
          {
            label: 'Yesterday',
            value: RELATIVE_VALUES.YESTERDAY,
          },
        ]}
      />
    );

    // first open the menu
    userEvent.click(screen.getAllByLabelText('Calendar')[0]);

    userEvent.click(screen.getByText(/Custom Range/));
    const yesterday = dayjs().subtract(1, 'days');

    userEvent.click(screen.getByLabelText('Increment hours'));
    expect(
      screen.getByText(
        `${yesterday.subtract(1, 'minute').format('YYYY-MM-DD')} 01:00 to ${yesterday.format(
          'YYYY-MM-DD'
        )} 01:00`
      )
    ).toBeVisible();
  });

  it('should switch from relative to presets', () => {
    render(<DateTimePicker {...dateTimePickerProps} defaultValue={defaultRelativeValue} />);

    // first open the menu
    userEvent.click(screen.getAllByLabelText('Calendar')[0]);

    expect(screen.getByText('Relative')).toBeInTheDocument();

    // go back to preset
    userEvent.click(screen.getByText('Back'));

    expect(screen.getByText('Custom Range')).toBeInTheDocument();
  });

  it('should keep preset value when switching from presets to relative and back', () => {
    render(<DateTimePicker {...dateTimePickerProps} />);

    // first open the menu
    userEvent.click(screen.getAllByLabelText('Calendar')[0]);

    userEvent.click(screen.getByText(/Custom Range/));

    // go back to preset
    userEvent.click(screen.getByText('Back'));

    expect(screen.getByText('Custom Range')).toBeInTheDocument();
  });

  it('should render with programmatically set absolute range', () => {
    const { rerender } = render(<DateTimePicker {...dateTimePickerProps} />);

    expect(screen.getByText(PRESET_VALUES[0].label)).toBeVisible();

    rerender(<DateTimePicker {...dateTimePickerProps} defaultValue={defaultAbsoluteValue} />);

    expect(screen.getByText('2020-04-01 12:34 to 2020-04-06 10:49')).toBeVisible();

    // first open the menu
    userEvent.click(screen.getAllByLabelText('Calendar')[0]);

    userEvent.click(screen.getAllByLabelText('Increment hours')[0]);
    expect(screen.getByText('2020-04-01 13:34 to 2020-04-06 10:49')).toBeVisible();

    userEvent.click(screen.getByText('Back'));
    userEvent.click(screen.getByText('Cancel'));

    expect(dateTimePickerProps.onCancel).toHaveBeenCalled();
    expect(screen.getByText('2020-04-01 12:34 to 2020-04-06 10:49')).toBeVisible();
  });

  it('changing the absolute range and applying', () => {
    render(<DateTimePicker {...dateTimePickerProps} defaultValue={defaultAbsoluteValue} />);
    // first open the menu and select custom range
    userEvent.click(screen.getAllByLabelText('Calendar')[0]);
    // Select absolute
    expect(screen.getByText(/Absolute/)).toBeInTheDocument();
    userEvent.click(screen.getAllByLabelText('Increment hours')[0]);
    expect(screen.getByText('2020-04-01 13:34 to 2020-04-06 10:49')).toBeVisible();
    userEvent.click(screen.getByText('Apply'));
    // This should be displayed
    expect(screen.getByText('2020-04-01 13:34 to 2020-04-06 10:49')).toBeVisible();
  });

  it('i18n string test', () => {
    const i18nTest = {
      toLabel: 'to-label',
      toNowLabel: 'to-now-label',
      calendarLabel: 'calendar-label',
      presetLabels: ['last-30-min', 'last-1-hour', 'last-6-hour', 'last-12-hour', 'last-24-hour'],
      intervalLabels: ['mins', 'hrs', 'dys', 'wks', 'mths', 'yrs'],
      relativeLabels: ['today', 'yesterday'],
      customRangeLinkLabel: 'custom-range',
      customRangeLabel: 'custom-range-2',
      relativeLabel: 'relative',
      lastLabel: 'last',
      invalidNumberLabel: 'number-is-not-valid',
      relativeToLabel: 'relative-to',
      absoluteLabel: 'absolute',
      startTimeLabel: 'start-time',
      endTimeLabel: 'end-time',
      applyBtnLabel: 'apply',
      cancelBtnLabel: 'cancel',
      backBtnLabel: 'back',
    };

    const presets = [
      {
        id: 'item-01',
        label: 'last-30-min',
        offset: 30,
      },
      {
        id: 'item-02',
        label: 'last-1-hour',
        offset: 60,
      },
      {
        id: 'item-03',
        label: 'last-6-hour',
        offset: 360,
      },
      {
        id: 'item-04',
        label: 'last-12-hour',
        offset: 720,
      },
      {
        id: 'item-05',
        label: 'last-24-hour',
        offset: 1440,
      },
    ];

    const i18nDefault = DateTimePicker.defaultProps.i18n;

    const relatives = [
      {
        label: 'today',
        value: RELATIVE_VALUES.TODAY,
      },
      {
        label: 'yesterday',
        value: RELATIVE_VALUES.YESTERDAY,
      },
    ];

    render(
      <DateTimePicker id="datetimepicker" presets={presets} i18n={i18nTest} relatives={relatives} />
    );

    // first open the menu
    userEvent.click(screen.getAllByLabelText(i18nTest.calendarLabel)[0]);

    i18nTest.presetLabels.forEach((label) => {
      expect(screen.getAllByText(label)[0]).toBeInTheDocument();
    });
    expect(screen.getAllByText(i18nTest.toNowLabel, { exact: false })[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(i18nTest.calendarLabel)).toHaveLength(3);
    expect(screen.getByText(i18nTest.customRangeLinkLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.applyBtnLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.cancelBtnLabel)).toBeInTheDocument();

    i18nDefault.presetLabels.forEach((label) => {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    });
    expect(screen.queryByText(i18nDefault.toNowLabel, { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefault.calendarLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.customRangeLinkLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.applyBtnLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.cancelBtnLabel)).not.toBeInTheDocument();
    // custom relative range screen
    fireEvent.click(screen.getByText(i18nTest.customRangeLinkLabel));
    i18nTest.intervalLabels.forEach((label) => {
      expect(screen.getAllByText(label)[0]).toBeInTheDocument();
    });
    i18nTest.relativeLabels.forEach((label) => {
      expect(screen.getAllByText(label)[0]).toBeInTheDocument();
    });
    expect(screen.getByText(i18nTest.customRangeLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.backBtnLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.relativeLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.lastLabel)).toBeInTheDocument();

    i18nDefault.intervalLabels.forEach((label) => {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    });
    i18nDefault.relativeLabels.forEach((label) => {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    });
    expect(screen.queryByText(i18nDefault.customRangeLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.backBtnLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.relativeLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.lastLabel)).not.toBeInTheDocument();
    // custom range absolute screen.
    fireEvent.click(screen.getByText(i18nTest.absoluteLabel));
    expect(screen.getByText(i18nTest.startTimeLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.endTimeLabel)).toBeInTheDocument();

    expect(screen.queryByText(i18nDefault.startTimeLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.endTimeLabel)).not.toBeInTheDocument();
    // click apply
    fireEvent.click(screen.getByText(i18nTest.applyBtnLabel));
    expect(screen.getAllByTitle(new RegExp(`.*${i18nTest.toLabel}.*`))[0]).toBeInTheDocument();

    expect(
      screen.queryByTitle(new RegExp(`.*\\s${i18nDefault.toLabel}\\s.*`))
    ).not.toBeInTheDocument();
  });
});
