import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Grid, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { Control, FieldValues } from 'react-hook-form';
import { IoAlbumsOutline } from 'react-icons/io5';
import { FormField, renderField } from '..';

interface GroupFieldProps {
  control?: Control<FieldValues>;
  name: string;
  label: string;
  description?: string;
  helper_text?: string;
  fields: FormField[];
}

export const GroupField = ({
  label,
  control,
  fields,
  name,
  description,
  helper_text,
}: GroupFieldProps) => {
  return (
    <Accordion sx={{ mt: 3 }}>
      {label && (
        <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
          <Typography
            className="flex gap-1 items-center"
            variant="subtitle1"
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            <IoAlbumsOutline />
            {label}
          </Typography>
        </AccordionSummary>
      )}
      <AccordionDetails>
        <Grid container spacing={2}>
          {fields.map((fieldDef) => {
            const uniqueField = {
              ...fieldDef,
              name: `${name}.${fieldDef.name}`,
            };
            return (
              <Grid item key={fieldDef.name} xs={12} lg={fieldDef?.size}>
                {renderField(uniqueField, control, {})}
              </Grid>
            );
          })}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};


